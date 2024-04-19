import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const exportedMethods = {
  async getUserById(id) {
    if (!id) {
      throw "You must provide an id to search for";
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (user === null) {
      throw "No user with that id";
    }
    return user;
  },

  async updateUser(id, updatedUser) {
    console.log("updateUser method called");
    if (!id || !updatedUser) {
      throw "You must provide an id and updated user information to update";
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "No user with that id";
    }

    if (updatedUser.firstName == undefined) {
      throw new Error("You must provide a first name to update");
    }
    if (updatedUser.lastName == undefined) {
      throw new Error("You must provide a last name to update");
    }
    if (updatedUser.email == undefined) {
      throw new Error("You must provide an email to update");
    }
    if (updatedUser.password == undefined) {
      throw new Error("You must provide a password to update");
    }
    if (updatedUser.gender == undefined) {
      throw new Error("You must provide a gender to update");
    }
    if (updatedUser.city == undefined) {
      throw new Error("You must provide a city to update");
    }
    if (updatedUser.state == undefined) {
      throw new Error("You must provide a state to update");
    }
    if (updatedUser.age == undefined) {
      throw new Error("You must provide an age to update");
    }

    let updatedUserData = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      password: updatedUser.password,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
    };

    const updatedInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUserData }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }

    return await this.getUserById(id);
  },
};

export default exportedMethods;
