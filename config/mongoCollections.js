import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below!
export const institutions = getCollectionFn("institutions");
export const appointments = getCollectionFn("appointments");
export const users = getCollectionFn("users");
export const posts = getCollectionFn("posts");
export const comments = getCollectionFn("comments");
export const pets = getCollectionFn("pets");
export const reviews = getCollectionFn("reviews");
export const journal = getCollectionFn("journal");


