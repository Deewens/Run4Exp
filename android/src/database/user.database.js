import Database from "./database";
import UserModel from "./models/UserModel";

let userDatabase = Database('users', UserModel);

export default () => {
  
  let addData = (object) => {
    return userDatabase.addData(object);
  }
  
  let first = () => {
    return userDatabase.listAll()[0];
  }
  
  let updateById = (id, object) => {
    return userDatabase.updateById(id, object);
  }
  
  let deleteAll = () => {
    return userDatabase.executeQuery("DELETE from users");
  }

  return {
    initTable: challengeDatabase.initTable,
    addData,
    updateById,
    first,
    deleteAll
  }
}
