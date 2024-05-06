import { users, journal } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { postHelpers, getCurrentDateTime, validators, formatTimeAgo } from "../helper.js";
import { petData } from "./index.js";


const createJournalEntry = async (journalObj) => {
    if (journalObj?.userID === undefined) throw `Need User ID.`;
    journalObj.userID = postHelpers.isuserIDValid(journalObj.userID);
    const user = await users();
    const existing_user = await user.findOne({
      _id: new ObjectId(journalObj.userID),
    });
    if (!existing_user) {
      throw "User with same user ID doesnot exists";
    }

    if (journalObj?.pet === undefined) throw `Pet needs to be Provided.`;
  
    // journalObj.content = postHelpers.iscontentValid(journalObj.content);
    // journalObj.pet = postHelpers.istypeValid(journalObj.type);

    // if (journalObj?.content === undefined) throw `Content needs to be Provided.`;

    // if (journalObj?.image === undefined) throw `Image needs to be Provided.`;

    if (journalObj?.content === undefined && journalObj?.image === undefined) {
      throw `Either content or image needs to be provided.`;
  }

  if(journalObj?.content === undefined){
    journalObj.content = '';
  }

  if(journalObj?.image === undefined){
    journalObj.image = {};
    journalObj.hasImage = false;
  }else{
    journalObj.hasImage = true;
  }
  
    const updatedtime = new Date();
  
    const newPost = {
      content: journalObj.content,
      image: journalObj.image,
      hasImage: journalObj.hasImage,
      pet: journalObj.pet,
      userID: new ObjectId(journalObj.userID),
      updatedtime: updatedtime,
    };
  
    const jounralCollection = await journal();
    const insertEntry = await jounralCollection.insertOne(newPost);
    if (!insertEntry.acknowledged || !insertEntry.insertedId)
      throw `Could not add Journal`;
  
    const newId = insertEntry.insertedId.toString();
    return newId;
  };

  const getJournalFromId = async (jId) => {
    if(!jId) throw "Journal ID needs to be provided";
    jId = validators.checkId(jId);
    const jounralCollection = await journal();
    const j = await jounralCollection.findOne({_id: new ObjectId(jId)});
    if(!j) throw `No journal found with ID: ${jId}`;
    j.pet = await petData.getPetDetails(j.pet)
    return j;
  }

  const getAllUserJournalEntries = async (userId) => {
    const jounralCollection = await journal()
    const journalEntriesList = await jounralCollection.find({userID: new ObjectId(userId)}).sort({ updatedtime: -1 }).toArray();
    for (let i = 0; i < journalEntriesList.length; i++) {
      const element = journalEntriesList[i];
      element._id = element._id.toString();
      element.pet = await petData.getPetDetails(element.pet);
      element.updatedtime = formatTimeAgo(element.updatedtime)
  }
  // console.log(journalEntriesList)
    return journalEntriesList;;

  }

  const deleteJournalEntry = async (userId, jId) => {
    if(!jId) throw "Journal ID needs to be provided";

    jId = validators.checkId(jId);

    const jounralCollection = await journal();

    const j = await jounralCollection.findOne({ _id: new ObjectId(jId) }); 
    if (!j) throw `No Journal found with the ID: ${jId}`;

    if(j.userID.toString() !== userId){
        throw "Only the journal owner can delete the entry"
    }

    const deletedEntryInfo = await jounralCollection.findOneAndDelete({_id: new ObjectId(jId)});
    if(!deletedEntryInfo) throw `The entry with ID ${jId} does not exist and could not be deleted`;
    return true;
  }

  const deletePetsJournal = async (petId) => {
    if(!petId) throw "Pet ID needs to be provided";
    petId = validators.checkId(petId);

    const jounralCollection = await journal();
    const deletedJournalInfo = await jounralCollection.deleteMany({pet: petId});
    // if(deletedCommentsInfo.deletedCount === 0) throw `No comments found with post ID: ${postId}`;

    return deletedJournalInfo.deletedCount;

}

  export default {createJournalEntry, getAllUserJournalEntries, getJournalFromId, deleteJournalEntry, deletePetsJournal}