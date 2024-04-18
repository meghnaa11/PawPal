import { Router } from "express";
const router = Router();

import * as postData from "../data/posts.js";
import * as helpers from "../helper.js";

// need to seperate routes for get post by generalid and lostfound id.

router.route("/general/:id").get(async (req, res) => {
  try {
    const postbyID = await postData.getPostsbyID(req.params.id);
    res.json(postbyID);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/general/").get(async (req, res) => {
  try {
    const posts = await postData.getAllGeneralPosts();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/general/add").post(async (req, res) => {
  const postFields = req.body;
  if (!postFields || Object.keys(postFields).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  try {
    if (postFields?.userID === undefined) throw `Need User ID.`;
    postFields.userID = helpers.postHelpers.isuserIDValid(postFields.userID);
    if (postFields?.title === undefined) throw `Title needs to be Provided.`;
    if (postFields?.content === undefined)
      throw `Content needs to be Provided.`;
    if (postFields?.type === undefined) throw `Type needs to be Provided.`;

    postFields.title = helpers.postHelpers.istitleValid(postFields.title);
    postFields.content = helpers.postHelpers.iscontentValid(postFields.content);
    postFields.type = helpers.postHelpers.istypeValid(postFields.type);

    if (!(postFields.type === "general")) throw `Type needs to be GENERAL`;
    else {
      if (postFields.lostfoundDetails)
        throw `General Post cannot have Lost-Found Details.`;
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }

  try {
    const postObj = {
      title: postFields.title,
      content: postFields.content,
      image: postFields.image,
      type: postFields.type,
      userID: postFields.userID,
    };
    const post = await postData.createPost(postObj);
    return res.json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.route("/lostfound/").get(async (req, res) => {
  try {
    const posts = await postData.getAllLFPosts();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/lostfound/add").post(async (req, res) => {
  const postFields = req.body;
  if (!postFields || Object.keys(postFields).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  try {
    if (postFields?.userID === undefined) throw `Need User ID.`;
    postFields.userID = helpers.postHelpers.isuserIDValid(postFields.userID);
    if (postFields?.title === undefined) throw `Title needs to be Provided.`;
    if (postFields?.content === undefined)
      throw `Content needs to be Provided.`;
    if (postFields?.type === undefined) throw `Type needs to be Provided.`;

    postFields.title = helpers.postHelpers.istitleValid(postFields.title);
    postFields.content = helpers.postHelpers.iscontentValid(postFields.content);
    postFields.type = helpers.postHelpers.istypeValid(postFields.type);

    if (!(postFields.type === "lost" || postFields.type === "found"))
      throw `Type needs to be LOST or FOUND`;
    else {
      if (!postFields.lostfoundDetails) throw `Must have Lost-Found Details.`;
      postFields.lostfoundDetails = helpers.postHelpers.islfdetailsValid(
        postFields.lostfoundDetails
      );
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }

  try {
    const postObj = {
      title: postFields.title,
      content: postFields.content,
      image: postFields.image,
      type: postFields.type,
      lostfoundDetails: postFields.lostfoundDetails,
      userID: postFields.userID,
    };
    const post = await postData.createPost(postObj);
    return res.json(post);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
