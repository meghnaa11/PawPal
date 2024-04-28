import { comments, posts } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { postHelpers, getCurrentDateTime, validators } from "../helper.js";

export const createPost = async (postObj) => {
  if (postObj?.userID === undefined) throw `Need User ID.`;
  postObj.userID = postHelpers.isuserIDValid(postObj.userID);
  const user = await users();
  const existing_user = await user.findOne({
    _id: new ObjectId(postObj.userID),
  });
  if (!existing_user) {
    throw "User with same user ID doesnot exists";
  }
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
    if (postObj?.image === undefined) throw `Image needs to be Provided.`;
  } else {
    if (postObj.lostfoundDetails)
      throw `General Post cannot have Lost-Found Details.`;
  }

  const updatedtime = new Date();

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
  existing_user.posts.push(newId.toString());
  await user.updateOne(
    { _id: newPost.userID },
    { $set: { posts: existing_user.posts } }
  );

  //const post = await get(newId);
  return newId;
};

export const getAllGeneralPosts = async () => {
  const postsCollection = await posts();
  let postList = await postsCollection
    .find({ type: "general" })
    .sort({ updatedtime: -1 })
    .toArray();
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
    .sort({ updatedtime: -1 })
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
    .sort({ updatedtime: -1 })
    .toArray();
  if (!postList) throw `Could not get My Posts`;
  if (postList.length === 0) return postList;
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return postList;
};

export const removePost = async (id, userID) => {
  validators.checkId(id);
  validators.checkId(userID);
  const user = await users();
  let existing_user = await user.findOne({
    _id: new ObjectId(userID),
  });
  if (!existing_user) {
    throw "User with same user ID doesnot exists";
  }
  const postsCollection = await posts();
  const deletionInfo = await postsCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!deletionInfo) {
    throw `Could not delete post with id of ${id}`;
  }
  await user.updateOne({ _id: new ObjectId(userID) }, { $pull: { posts: id } });
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
