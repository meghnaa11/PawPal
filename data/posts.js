import { comments, posts } from "../config/mongoCollections.js";
import { user } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { postHelpers, getCurrentDateTime, validators } from "../helper.js";

export const createPost = async (postObj) => {
  if (postObj?.userID === undefined) throw `Need User ID.`;
  postObj.userID = postHelpers.isuserIDValid(postObj.userID);
  if (postObj?.title === undefined) throw `Title needs to be Provided.`;
  if (postObj?.content === undefined) throw `Content needs to be Provided.`;
  if (postObj?.type === undefined) throw `Type needs to be Provided.`;

  postObj.title = postHelpers.istitleValid(postObj.title);
  postObj.content = postHelpers.iscontentValid(postObj.content);
  postObj.type = postHelpers.istypeValid(postObj.type);

  if (postObj.type === "lost" || postObj.type === "found") {
    if (!postObj.lostfoundDetails)
      throw `LostFoundDetails needs to be Provided.`;
    postObj.lostfoundDetails = postHelpers.islfdetailsValid(
      postObj.lostfoundDetails
    );
  } else {
    if (postObj.lostfoundDetails)
      throw `General Post cannot have Lost-Found Details.`;
  }

  const updatedtime = getCurrentDateTime();

  const newPost = {
    title: postObj.title,
    content: postObj.content,
    image: postObj.image,
    type: postObj.type,
    lostfoundDetails: postObj.lostfoundDetails ? postObj.lostfoundDetails : {},
    userID: new ObjectId(postObj.userID),
    comments: [],
    updatedtime: updatedtime,
  };

  const postCollection = await posts();
  const insertPost = await postCollection.insertOne(newPost);
  if (!insertPost.acknowledged || !insertPost.insertedId)
    throw `Could not add Post`;

  const newId = insertPost.insertedId.toString();
  //const post = await get(newId);
  return newId;
};

export const getAllGeneralPosts = async () => {
  const postsCollection = await posts();
  let postList = await postsCollection.find({ type: "general" }).toArray();
  if (!postList) throw `Could not get all Posts`;
  if (postList.length === 0) return postList;
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return postList;
};

export const getAllLFPosts = async () => {
  const postsCollection = await posts();
  let postList = await postsCollection
    .find({ type: { $in: ["lost", "found"] } })
    .toArray();
  if (!postList) throw `Could not get all Posts`;
  if (postList.length === 0) return postList;
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return postList;
};

export const getPostsbyID = async (id) => {
  validators.checkId(id);
  const postCollection = await posts();
  const postbyID = await postCollection.findOne({ _id: new ObjectId(id) });
  if (postbyID === null) throw `No Product Found with given Id`;
  postbyID._id = postbyID._id.toString();
  return postbyID;
};

export const getmyPosts = async (id) => {
  validators.checkId(id);
  const postsCollection = await posts();
  let postList = await postsCollection
    .find({ userID: new ObjectId(id) })
    .toArray();
  if (!postList) throw `Could not get My Posts`;
  if (postList.length === 0) return postList;
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return postList;
};

export const removePost = async (id) => {
  validators.checkId(id);
  const postsCollection = await posts();
  const deletionInfo = await postsCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!deletionInfo) {
    throw `Could not delete post with id of ${id}`;
  }
  return deletionInfo;
};

export const removePostbyUser = async (id) => {
  validators.checkId(id);
  const postsCollection = await posts();
  const deletionInfo = await postsCollection.deleteMany({
    userID: new ObjectId(id),
  });
  if (!deletionInfo.acknowledged) {
    throw `Could not delete post from user with id of ${id}`;
  }
  return deletionInfo.deletedCount;
};

// try {
//   const newPost = {
//     title: "New Post Title",
//     content: "New Post Content",
//     image: "Image",
//     type: "lost",
//     lostfoundDetails: {
//       location: "Hoboken",
//       date: "02/02/2024",
//       contact_info: "84957485349",
//       pet_details: {
//         species: "dog",
//         breed: "whatever",
//         color: "red",
//         other_details: "it is a cat",
//       },
//     },
//     userID: "65d69f9de5cf3db66f90a055",
//   };

//   let id = await getPostsbyID("661b3b2ef8a3a24c68bbde82");
//   console.log(id);
// } catch (e) {
//   console.log(e);
// }
