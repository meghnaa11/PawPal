
import { user } from "../config/mongoCollections.js";
import { pet } from "../config/mongoCollections.js";

import { ObjectId } from "mongodb";

export const getPetList = async (userid) => {
 if (!userid) throw "You must provide an id to search for";
 if (typeof userid !== "string" || userid.trim() === "") throw "You must provide a valid id to search for";
 if (!ObjectId.isValid(userid)) throw "You must provide a valid id to search for";
 const userCollection = await user();
 const userObj = await userCollection.findOne({ _id: new ObjectId(userid) });
 const petList = userObj.pets;
 return petList;
}

export const getPet = async (petid) => {
 if (!petid) throw "You must provide an id to search for";
 if (typeof petid !== "string" || petid.trim() === "") throw "You must provide a valid id to search for";
 if (!ObjectId.isValid(petid)) throw "You must provide a valid id to search for";
 const petCollection = await pet();
 const petObj = await petCollection.findOne({ _id: new ObjectId(petid) });
 return petObj;
}