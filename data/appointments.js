import { appointments } from "../config/mongoCollections.js";
import { user } from "../config/mongoCollections.js";
import { institution } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const create = async (category, time, address, desc, institutionID, userID, petID) => {
 if (!category || !time || !address || !desc || !institutionID || !userID || !petID) {
  throw 'All fields need to be supplied';
 }
 if (typeof category !== 'string' || typeof address !== 'string' || typeof desc !== 'string' || typeof institutionID !== 'string' || typeof userID !== 'string' || typeof petID !== 'string') {
  throw 'input not strings'
 }
 category = category.trim();
 address = address.trim();
 desc = desc.trim();
 institutionID = institutionID.trim();


 if (category.length === 0 || address.length === 0 || desc.length === 0 || institutionID.length === 0 || userID.length === 0 || petID.length === 0) {
  throw 'input cannot be empty'
 }

 if (typeof institutionID !== 'string' || !ObjectId.isValid(institutionID)) throw 'Invalid institutionID';
 if (typeof userID !== 'string' || !ObjectId.isValid(userID)) throw 'Invalid userID';
 if (typeof petID !== 'string' || !ObjectId.isValid(petID)) throw 'Invalid petID';


 const appointmentCollection = await appointments();
 const newAppointment = {
  category: category,
  appointment_time: time,
  address: address,
  description: desc,
  institutionID,
  userID,
  petID,
 };

 const insertInfo = await appointmentCollection.insertOne(newAppointment);
 if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add appointment';

 const userCollection = await user();
 const userinfosUpdate = await userCollection.findOneAndUpdate({ _id: new ObjectId(userID) }, { $push: { appointments: insertInfo.insertedId.toString() } }, { returnDocument: 'after' });
 const institutionCollection = await institution();
 const institutionUpdate = await institutionCollection.findOneAndUpdate({ _id: new ObjectId(institutionID) }, { $push: { appointments: insertInfo.insertedId.toString() } }, { returnDocument: 'after' });
 if (!userinfosUpdate || !institutionUpdate) throw 'Could not add appointment';

 return await get(insertInfo.insertedId.toString());
}


export const getAllByUserId = async (id) => {
 if (!id) {
  throw 'id not supplied';
 }
 if (typeof id !== 'string') {
  throw 'id not a string';
 }
 if (id.trim().length === 0) {
  throw 'id cannot be empty';
 }
 if (!ObjectId.isValid(id)) throw 'Invalid id';

 const userCollection = await user();
 const userObj = await userCollection.findOne({ _id: new ObjectId(id) });

 if (userObj === null) throw 'No user with that id';
 return userObj.appointments;
}

export const getAllByInsId = async (id) => {
 if (!id) {
  throw 'id not supplied';
 }
 if (typeof id !== 'string') {
  throw 'id not a string';
 }
 if (id.trim().length === 0) {
  throw 'id cannot be empty';
 }
 if (!ObjectId.isValid(id)) throw 'Invalid id';

 const institutionCollection = await institution();
 const institutionObj = await institutionCollection.findOne({ _id: new ObjectId(id) });

 if (institutionObj === null) throw 'No institution with that id';

 return institutionObj.appointments;
}

export const get = async (id) => {
 if (!id) {
  throw 'id not supplied';
 }
 if (typeof id !== 'string') {
  throw 'id not a string';
 }
 if (id.trim().length === 0) {
  throw 'id cannot be empty';
 }
 if (!ObjectId.isValid(id)) throw 'Invalid id';

 const appointmentCollection = await appointments();
 const appointment = await appointmentCollection.findOne({ _id: new ObjectId(id) });

 if (appointment === null) throw 'No appointment with that id';
 return appointment;
}


