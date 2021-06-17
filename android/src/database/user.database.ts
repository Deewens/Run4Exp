import Database from "./database";
import UserModel from "./models/UserModel";

let userDatabase = Database("users", UserModel);

export default () => {
  let first = async () => {
    let list = await userDatabase.listAll();

    return list[0];
  };

  let deleteAll = async () => {
    return userDatabase.executeQuery("DELETE from users");
  };

  return {
    ...userDatabase,
    first,
    deleteAll,
  };
};
