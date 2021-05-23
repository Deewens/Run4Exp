export const db = SQLite.openDatabase('acrobatt.db')

export default (tableName, properties) => {

  let initTable = () => {

    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT`;

    properties.forEach(property => {
      query += `, ${property.name} ${property.type}`;
    });

    query += `)`

    db.transaction(tx => {
      tx.executeSql(query)
    });

  }

  initTable();

  let selectById = (id) => {

    return selectWhere('id', id);
  }

  let selectWhere = (propertyName, propertyValue) => {

    let result = null;

    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName} ${propertyName} = ${propertyValue}`, null,
        (txObj, { rows: { _array } }) => {
          result = _array[0];
        },
        (txObj, error) => console.log('Error ', error)
      )
    });

    return result;
  }

  let list = async () => {

    let result = [];

    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName}`, null,
        (txObj, { rows: { _array } }) => {
          result = _array;
        },
        (txObj, error) => console.log('Error ', error)
      )
    });

    return result;
  };

  let listWhere = async (propertyName, propertyValue) => {

    let result = null;

    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName} where ${propertyName} = ${propertyValue}`, null,
        (txObj, { rows: { _array } }) => {
          result = _array;
        },
        (txObj, error) => console.log('Error ', error)
      )
    });

    return result;
  };

  let addData = (object, callback) => {
    let query = `INSERT INTO ${tableName} (`

    properties.forEach(property => {
      query += `${property.name} ${property.type},`;
    });

    query = query.slice(0, -1);

    query += `) values (`;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        query += `${value} ,`;
      }
    }

    query = query.slice(0, -1);

    query += `)`;

    db.transaction(tx => {
      tx.executeSql(query, [], callback,
        (txObj, error) => console.log('Error', error))
    })
  };

  let updateById = async (id, object) => {
    return updateBy('id', id, object);
  };


  let updateBy = async (propertyName, propertyValue, object) => {

    let result = null;

    let query = `UPDATE ${tableName} SET (`;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const value = object[key];
        query += `${key} = ${value},`;
      }
    }

    query = query.slice(0, -1);

    query += ` WHERE ${propertyName} = ${propertyValue}`;

    db.transaction(tx => {
      tx.executeSql(query, null, null,
        (txObj, error) => console.log('Error ', error)
      )
    });

    return result;
  };

  return {
    initTable,
    selectById,
    selectWhere,
    addData,
    list,
    listWhere,
    updateById,
    updateBy,
  }
}