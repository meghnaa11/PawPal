import { pets } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js'
import * as appoinmentData from './appointments.js'

const petDataFunctions = {
    async addPets(name, species, breed, description, petImage, userID) {
        if (!name) {
            throw 'Email ID not entered'
        }
        if (typeof name !== 'string') {
            throw 'Type should be string'
        }
        if (name.trim() === "") {
            throw 'Only empty spaces'
        }
        if (!species) {
            throw 'Email ID not entered'
        }
        if (typeof species !== 'string') {
            throw 'Type should be string'
        }
        if (species.trim() === "") {
            throw 'Only empty spaces'
        }
        if (!breed) {
            throw 'Breed not entered'
        }
        if (typeof breed !== 'string') {
            throw 'Type should be string'
        }
        if (breed.trim() === "") {
            throw 'Only empty spaces'
        }
        if (!description) {
            throw 'Description not entered'
        }
        if (typeof description !== 'string') {
            throw 'Type should be string'
        }
        if (description.trim() === "") {
            throw 'Only empty spaces'
        }

        let updatedTime = new Date();
        if (!userID) {
            throw 'User ID not entered'
        }
        if (!ObjectId.isValid(userID)) {
            throw 'Not a Valid Object ID'
        }
        if (!petImage) {
            throw 'No Profile Image uploaded'
        }
        const user = await users()

        const existing_user = await user.findOne({ _id: userID })
        if (!existing_user) {
            throw 'User with same user ID doesnot exists'
        }

        const newPet = {
            name: name,
            species: species,
            breed: breed,
            description: description,
            profileImage: petImage,
            updatedTime: updatedTime,
            userID: userID.toString()

        }
        const pet = await pets()
        const create_pet = await pet.insertOne(newPet)

        if (create_pet.acknowledged || create_pet.insertedId) {
            console.log("Pet Added successfully");
            existing_user.pets.push(create_pet.insertedId.toString());
            await user.updateOne({ _id: userID }, { $set: { pets: existing_user.pets } })
        }
        else {
            throw 'Could not add pet'
        }
        return create_pet;
    },

    async updatePetDetails(pet_id_pass, updatedFields) {
        //console.log("fe")
        const pet = await pets()
        //console.log(updatedFields)
        if (!updatedFields) {
            return;
        }
        const updatedPet = await pet.updateOne(
            { _id: new ObjectId(pet_id_pass) },
            { $set: updatedFields }

        );


        if (updatedPet.modifiedCount !== 1) {
            throw 'Pet Update failed'
        }
        return updatedPet;
    },

    async getPetDetails(pet_id) {
        if (!pet_id) {
            throw 'No Pet ID provided'
        }
        const pet = await pets()
        const view_current_pet = await pet.findOne({ _id: new ObjectId(pet_id) })
        if (!view_current_pet) {
            res.send("Pet not found")
        }
        const display_pet_data = {
            id: pet_id,
            name: view_current_pet.name,
            species: view_current_pet.species,
            breed: view_current_pet.breed,
            description: view_current_pet.description,
            profileImage: view_current_pet.profileImage
        }
        return display_pet_data;
    },

    async deletePet(pet_id, user_id) {
        if (!pet_id) {
            throw 'No Pet ID provided'
        }
        if (!user_id) {
            throw 'No User ID provided'
        }
        const user = await users()
        const current_user = await user.findOne({ _id: new ObjectId(user_id) });
        if (!current_user) {
            throw 'No user found'
        }
        const updating_user = await user.updateOne(
            { _id: new ObjectId(user_id) },
            { $pull: { pets: { $in: [pet_id] } } }
        )
        if (!updating_user) {
            throw 'Delete operation failed from user'
        }
        const applist = await appoinmentData.getAllbyPetId(pet_id);
        if (applist.length > 0) {
            for (let i = 0; i < applist.length; i++) {
                const delete_appointment = await appoinmentData.remove(applist[i]._id.toString())
                if (!delete_appointment) {
                    throw 'Failed to delete appointment'
                }
            }
        }
        const pet = await pets()
        const delete_current_pet = await pet.findOne({ _id: new ObjectId(pet_id) })
        if (!delete_current_pet) {
            throw 'Pet Not Found for Deletion'
        }
        const deleted_pet = await pet.deleteOne({ _id: new ObjectId(pet_id) })
        if (!deleted_pet) {
            throw 'Failed to delete'
        }
        return deleted_pet;
    },

    async getAllPetsOfUser(userId){
        const petCollection = await pets()
        const petList = await petCollection.find({userID: userId}).toArray();
        console.log(petList)
        petList.forEach(element => {
            element._id = element._id.toString();
            element.userID = element.userID.toString();
    
        }); 
        return petList;
    }

}
export default petDataFunctions;
