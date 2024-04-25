import { institutions } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const institutionDataFunctions = {
  async institutionRegistration(
    name,
    email,
    services,
    address,
    city,
    state,
    hashedPassword,
    confirmhashedPassword,
    instituteImage
  ) {
    if (
      !email ||
      typeof email !== "string" ||
      email.trim() === "" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email.toLowerCase()
      )
    ) {
      throw "Invalid Email";
    }

    const institutionCollection = await institutions();
    const existingInstitution = await institutionCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingInstitution) {
      throw "Institution with the same email already exists";
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw "Invalid Name";
    }

    if (!address || typeof address !== "string" || address.trim() === "") {
      throw "Invalid Address";
    }

    if (!city || typeof city !== "string" || city.trim() === "") {
      throw "Invalid City";
    }

    if (!hashedPassword || typeof hashedPassword !== "string") {
      throw "Invalid Password";
    }

    if (!state || typeof state !== "string") {
      throw "Invalid State";
    }

    if (
      !services ||
      !Array.isArray(services) ||
      services.some(
        (service) => typeof service !== "string" || service.trim() === ""
      )
    ) {
      throw "Invalid Services";
    }

    if (hashedPassword !== confirmhashedPassword) {
      throw "Passwords do not match";
    }

    const newInstitution = {
      name: name,
      email: email.toLowerCase(),
      services: services,
      address: address,
      city: city,
      state: state,
      hashedPassword: hashedPassword,
      profileImage: instituteImage
    };

    // const institutionCollection = await institutions();
    const create_institution = await institutionCollection.insertOne(
      newInstitution
    );

    if (create_institution.acknowledged || create_institution.insertedId) {
      console.log("Institution Added successfully");
    } else {
      throw "Could not add Institution";
    }

    return create_institution;
  },

  async updateInstitutionDetails(institutionID, updatedFields) {
    if (!institutionID) {
      throw "No Institution ID";
    }
    if (!updatedFields) {
      throw "No Update Fields provided";
    }

    const institutionCollection = await institutions();
    const updatedInstitution = await institutionCollection.updateOne(
      { _id: institutionID },
      { $set: updatedFields }
    );

    if (updatedInstitution.modifiedCount !== 1) {
      throw "Institution Update failed";
    }

    return updatedInstitution;
  },

  async getInstitutionById(id) {
    if (!id) {
      throw "You must provide an id to search for";
    }

    const institutionCollection = await institutions();
    const institution = await institutionCollection.findOne({
      _id: new ObjectId(id),
    });

    if (institution === null) {
      throw "No institution with that id";
    }

    return institution;
  },
};

export default institutionDataFunctions;
