import { reviews } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

// Function to create a new review
export const create = async (rating, content, userID, institutionID) => {
 if (!rating || !content || !userID || !institutionID) {
  throw 'All fields must be provided';
 }

 const reviewsCollection = await reviews();
 const newReview = {
  content: content,
  rating: rating,
  institutionID: new ObjectId(institutionID),
  userID: new ObjectId(userID)
 };

 const insertInfo = await reviewsCollection.insertOne(newReview);
 if (insertInfo.insertedCount === 0) throw 'Could not add review';

 return await reviewsCollection.findOne({ _id: insertInfo.insertedId });
};

export const getAllByInsId = async (institutionID) => {
 if (!institutionID) throw 'Institution ID must be provided';

 const reviewsCollection = await reviews();
 const query = { institutionID: new ObjectId(institutionID) };
 const reviewList = await reviewsCollection.find(query).toArray();


 return reviewList;
};


export const getAllByUserId = async (userID) => {
 if (!userID) throw 'User ID must be provided';

 const reviewsCollection = await reviews();
 const query = { userID: new ObjectId(userID) };
 const reviewList = await reviewsCollection.find(query).toArray();


 return reviewList;
};

export const getReviewByuseridinsid = async (userID, institutionID) => {
 if (!userID || !institutionID) throw 'User ID and Institution ID must be provided';

 const reviewsCollection = await reviews();
 const query = { userID: new ObjectId(userID), institutionID: new ObjectId(institutionID) };
 const reviewList = await reviewsCollection.findOne(query);
 if (!reviewList) return { found: false };
 return { found: true, review: reviewList };
}
