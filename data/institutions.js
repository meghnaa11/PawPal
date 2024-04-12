import { institution } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const create = async (name, service_provided, phone, address, city, state, userID) => {
 if (!name || !service_provided || !phone || !address || !city || !state || !userID) {
  throw 'All fields need to be supplied';
 }
 if (typeof name !== 'string' || typeof service_provided !== 'string' || typeof phone !== 'string' || typeof address !== 'string' || typeof city !== 'string' || typeof state !== 'string') {
  throw 'input not strings'
 }
 name = name.trim();
 service_provided = service_provided.trim();
 phone = phone.trim();
 address = address.trim();
 city = city.trim();
 state = state.trim();

 if (name.length === 0 || service_provided.length === 0 || phone.length === 0 || address.length === 0 || city.length === 0 || state.length === 0) {
  throw 'input cannot be empty'
 }

 const institutionCollection = await institution();
 const newInstitution = {
  name: name,
  service_provided: service_provided,
  phone: phone,
  address: address,
  city: city,
  state: state,
  userID: userID,
  appointments: []
 };

 const insertInfo = await institutionCollection.insertOne(newInstitution);
 if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add institution';


 return insertInfo.insertedId;

}

export const getAll = async () => {
 const institutionCollection = await institution();
 const institutionList = await institutionCollection.find({}).toArray();
 return institutionList;
}

export const get = async (id) => {
 if (!id) {
  throw 'id not supplied';
 }
 if (typeof id !== 'string') {
  throw 'id not a string';
 }
 if (id.length === 0) {
  throw 'id cannot be empty';
 }
 if (!ObjectId.isValid(id)) {
  throw 'invalid id';
 }
 const institutionCollection = await institution();
 const institutionInfo = await institutionCollection.findOne({ _id: new ObjectId(id) });
 if (institutionInfo === null) {
  throw 'No institution with that id';
 }
 return institutionInfo;
}
