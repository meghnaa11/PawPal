import { institutions } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
const exportedMethods = {
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

export default exportedMethods;
