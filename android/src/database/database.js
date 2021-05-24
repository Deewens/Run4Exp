import * as SQLite from 'expo-sqlite';

export default (tableName, properties) => {
  const db = SQLite.openDatabase('acrobatt.db');

  let initTable = async () => {
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    properties.forEach(property => {
      query += `${property.name} ${property.type},`;
    });
    query = query.slice(0, -1);

    query += `)`

    await db.transaction(async (tx) => {
      await tx.executeSql(query)
    });

  }

  let executeQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
          reject(error);
        });
    });
  });


  let selectById = async (id) => {
    let selected = await executeQuery(`SELECT * FROM ${tableName} WHERE id = ${id}`, null);

    return selected;
  }

  let selectWhere = async (propertyName, propertyValue) => {
    let selected = await executeQuery(`SELECT * FROM ${tableName} WHERE ${propertyName} = "${propertyValue}"`, null);

    return selected?.rows?._array[0];
  }

  let listAll = async () => {
    let result = await executeQuery(`SELECT * FROM ${tableName}`, null);

    return result?.rows?._array;
  };

  let listWhere = async (propertyName, propertyValue) => {
    let result = await executeQuery(`SELECT * FROM ${tableName} where ${propertyName} = "${propertyValue}"`, null);

    return result?.rows?._array;
  };

  let addData = async (object) => {
    let query = `INSERT INTO ${tableName} (`

    properties.forEach(property => {
      query += `${property.name},`;
    });

    query = query.slice(0, -1);

    query += `) values (`;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        query += `"${value}" ,`;
      }
    }

    query = query.slice(0, -1);

    query += `)`;

    let result = await executeQuery(query, null);
    return result;
  };

  let updateById = async (id, object) => {
    let query = `UPDATE ${tableName} SET `;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        if(value != null) {
          query += `${key} = "${value}",`;
        }
      }
    }

    query = query.slice(0, -1);

    query += ` WHERE id = ${id}`;

    let result = await executeQuery(query, null);
    return result;
  };


  let updateBy = async (propertyName, propertyValue, object) => {

    let query = `UPDATE ${tableName} SET `;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        query += `${key} = ${value},`;
      }
    }

    query = query.slice(0, -1);

    query += ` WHERE ${propertyName} = ${propertyValue}`;

    let result = await executeQuery(query, null);
    return result;
  };

  return {
    initTable,
    selectById,
    selectWhere,
    addData,
    listAll,
    listWhere,
    updateById,
    updateBy,
    db,
  }
}