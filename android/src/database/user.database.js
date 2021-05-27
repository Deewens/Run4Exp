import Database from "./database";
import UserModel from "./models/UserModel";

let userDatabase = Database('users', UserModel);

export default () => {
  
  let addData = async (object) => {
    return userDatabase.addData(object);
  }
  
  let first = async () => {
    let list = await userDatabase.listAll();

    return list[0];
  }
  
  let updateById = async (id, object) => {
    return userDatabase.updateById(id, object);
  }
  
  let deleteAll = async () => {
    return userDatabase.executeQuery("DELETE from users");
  }

  let selectById = async (id) => {
    return userDatabase.selectById(id)
  }

  return {
    initTable: userDatabase.initTable,
    addData,
    updateById,
    first,
    deleteAll,
    selectById
  }
}
