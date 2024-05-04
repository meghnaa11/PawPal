import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import fs from 'fs'
import bcrypt from "bcryptjs";

const userDataFunctions = {
  async userRegistration(
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    age,
    hashedPassword,
    confirmhashedPassword,
    profileImage
    
  ) {
        if(!email){
          throw 'Email ID not entered'
      }
      if(typeof email!== 'string'){
          throw 'Type should be string'
      }
      if(email.trim()===""){
          throw 'Only empty spaces'
      }
      email = email.toLowerCase();
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
          throw 'Invalid Email'
      }
      // const user = await users();
      // const existing_user = await user.findOne({email:email})
      // if(existing_user){
      //     throw 'User with same user ID already exists'
      // }
      if(!firstName){
          throw 'Firstname not Entered'
      }
      if(firstName.trim()===""){
          throw 'Only empty spaces'
      }
      if(typeof firstName!== 'string'){
          throw 'Type should be string'
      }
      if(!lastName){
          throw 'Lastname not Entered'
      }
      if(lastName.trim()===""){
          throw 'Only empty spaces'
      }
      if(typeof lastName!== 'string'){
          throw 'Type should be string'
      }
      if(!gender){
          throw 'Gender not Selected'
      }
      if(!city){
          throw 'City not Entered'
      }
      if(typeof city!== 'string'){
          throw 'Type should be string'
      }
      if(city.trim()===""){
          throw 'Only empty spaces'
      }
      if(!state){
          throw 'State not Selected'
      }
      if(!age){
          throw 'Age not entered'
      }
      if(typeof age!== 'number'){
          throw 'Type should be number'
      }
      
      if(age<0 || age>120){
          throw 'Invalid age'
      }
      if(age<16){
          throw 'User should be minimum of age 16 to register'
      }
      
      if(!hashedPassword){
          throw 'Password Not Entered'
      }
      if(typeof hashedPassword!== 'string'){
          throw 'Type should be hashed string'
      }
      if(!hashedPassword){
          throw 'Password not present'
      }
      if(!confirmhashedPassword){
          throw 'Password not present'
      }
      if(typeof hashedPassword!== 'string'){
          throw 'Password should be of type string'
      }
      if(typeof confirmhashedPassword!== 'string'){
          throw 'Password should be of type string'
      }
      if(!profileImage){
        throw 'No Profile Image uploaded'
      }
      // if(typeof profileImage!== 'string'){
      //   throw 'Image not in string format'
      // }
      firstName = firstName.trim()
      lastName = lastName.trim()
      city = city.trim()
      
    
    // Check if user with same email already exists
    const userCollection = await users();
    const existingUser = await userCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw "User with the same email already exists";
    }

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      email: email.toLowerCase(),
      gender,
      city: city.trim(),
      state,
      age,
      hashedPassword,
      profileImage: profileImage,
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    };

    const createUser = await userCollection.insertOne(newUser);
    if (createUser.acknowledged || createUser.insertedId) {
      console.log("User Added successfully");
    } else {
      throw "Could not add user";
    }

    return createUser;
  },

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
  

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "No user with that id";
    }

    // Construct the updated user data
    const updatedUserData = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      password: updatedUser.password,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
    };

    // Update the user in the database
    const updatedInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUserData }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update user successfully";
    }

    return await this.getUserById(id);
  },

  async addUsersComments(id, commentId){
    try{
      const userCollection = await users();
      const user = await this.getUserById(id);
      //console.log(user);
      const currentComments = user.comments;
      currentComments.push(commentId);
      const insertComment = await userCollection.updateOne({ _id: new ObjectId(id) }, {$set: {comments: currentComments}});
      if (insertComment.modifiedCount !== 1) throw `Could not Update User`;
      return true;

    }catch(error){
      throw error;
    }
  },

  async deleteUsersComments(id, commentId){
    try{
      const userCollection = await users();
      const user = await this.getUserById(id);
      const currentComments = user.comments;
      const i = currentComments.indexOf(commentId);
      currentComments.splice(i, 1);
      const deleteComment = await userCollection.updateOne({ _id: new ObjectId(id) }, {$set: {comments: currentComments}});
      if (deleteComment.modifiedCount !== 1) throw `Could not Update User`;
      return true;

    }catch(error){
      throw error;
    }
  }

  async deleteUser(user_id){
    if(!user_id){
        throw 'No Pet ID provided'
    }
     
    const user = await users()
    const current_user = await user.findOne({_id:new ObjectId(user_id)});
    if(!current_user){
        throw 'No user found'
    }
    
    const deleted_user = await user.deleteOne({_id:new ObjectId(user_id)})
    if(!deleted_user){
        throw 'Failed to delete'
    }
    console.log(deleted_user)
    return deleted_user;
}
};


export default userDataFunctions;
