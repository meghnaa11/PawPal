import { Router } from "express";
const router = Router();

import * as postData from "../data/posts.js";
import * as helpers from "../helper.js";
import multer from "multer";
import * as commentData from "../data/comments.js"

import { userData } from "../data/index.js";
import { comments, posts } from "../config/mongoCollections.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/posts"); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generating unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");

router.route("/myposts").get(async (req, res) => {
  try {
    const postbyID = await postData.getmyPosts(req.session.user._id);
    res.render("posts/viewmyPosts", { posts: postbyID });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/search").get(async (req, res) => {
  try {
    res.render("posts/searchPosts");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/search").post(async (req, res) => {
  const searchTerm = req.body.q;
  let regex = new RegExp([".*", searchTerm, ".*"].join(""), "gi");
  try {
    const items = await postData.searchPosts(searchTerm);
    res.json(items);
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route("/postbyID/:id").get(async (req, res) => {
  try {
    const postbyID = await postData.getPostsbyID(req.params.id);
    const comments = await commentData.getAllComments(req.params.id);

    let isUsersPost = false;
    if (req.session.user._id === postbyID.userID.toString()) isUsersPost = true;

    for (const comment of comments) {
      console.log('Logged In User: ' + req.session.user._id);
      try {
          const user = await userData.getUserById(comment.userId);
          comment.user = user;
      } catch (error) {
          comment.user = {}; 
      }
      comment.isUsersComment = (comment.userId == req.session.user._id);
  }

    console.log(comments);

    res.render("posts/viewPost", {
      post: postbyID,
      comment:comments,
      isUsersPost: isUsersPost,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/postbyID/:id").delete(async (req, res) => {
  try {
    const postbyID = await postData.getPostsbyID(req.params.id);
    try {
      if (!(req.session.user._id === postbyID.userID.toString()))
        throw `403: Unauthorized`;
    } catch (e) {
      return res.status(403).json({ message: error });
    }

    const deletion = await postData.removePost(
      req.params.id,
      req.session.user._id
    );
    res.redirect("/posts/myposts");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/postbyID/:id/edit").get(async (req, res) => {
  try {
    let postbyID = await postData.getPostsbyID(req.params.id);
    if (!(Object.keys(postbyID.lostfoundDetails).length === 0))
      postbyID.lostfoundDetails.date = helpers.formatJSDate(
        postbyID.lostfoundDetails.date
      );
    try {
      if (!(req.session.user._id === postbyID.userID.toString()))
        throw `403: Unauthorized`;
    } catch (e) {
      return res.status(403).json({ message: e });
    }
    res.render("posts/editPosts", {
      postFields: postbyID,
      postID: req.params.id,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/postbyID/:id/edit").post(upload, async (req, res) => {
  const postID = req.params.id;
  const postbyID = await postData.getPostsbyID(req.params.id);
  try {
    if (!(req.session.user._id === postbyID.userID.toString()))
      throw `403: Unauthorized`;
  } catch (e) {
    return res.status(403).json({ message: error });
  }
  const postFields = {
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    image: req.file ? req.file : null,
    lostfoundDetails:
      req.body.type === "general"
        ? null
        : {
            location: req.body.details_location,
            date: req.body.details_date
              ? helpers.formatHTMLDate(req.body.details_date)
              : null,
            contact_info: req.body.details_contact,
            pet_details: {
              species: req.body.petdetails_species,
              breed: req.body.petdetails_breed,
              color: req.body.petdetails_color,
              other_details: req.body.petdetails_other,
            },
          },
  };
  if (!postFields || Object.keys(postFields).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  try {
    if (postFields?.title === undefined) throw `Title needs to be Provided.`;
    if (postFields?.content === undefined)
      throw `Content needs to be Provided.`;
    if (postFields?.type === undefined) throw `Type needs to be Provided.`;

    postFields.title = helpers.postHelpers.istitleValid(postFields.title);
    postFields.content = helpers.postHelpers.iscontentValid(postFields.content);
    postFields.type = helpers.postHelpers.istypeValid(postFields.type);

    if (
      !(
        postFields.type === "general" ||
        postFields.type === "lost" ||
        postFields.type === "found"
      )
    )
      throw `Type needs to be GENERAL or LOST or FOUND`;
    else {
      if (postFields.type === "lost" || postFields.type === "found") {
        if (!postFields.lostfoundDetails) throw `Must have Lost-Found Details.`;
        postFields.lostfoundDetails = helpers.postHelpers.islfdetailsValid(
          postFields.lostfoundDetails
        );
        if (postFields.image === null) delete postFields.image;
      } else {
        if (postFields.lostfoundDetails)
          throw `General Post cannot have Lost-Found Details.`;
      }
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    if (postFields.type === "lost" || postFields.type === "found") {
      // const postObj = {
      //   title: postFields.title,
      //   content: postFields.content,
      //   image: postFields.image,
      //   type: postFields.type,
      //   lostfoundDetails: postFields.lostfoundDetails,
      //   userID: postFields.userID,
      // };
      const post = await postData.updatePost(
        postFields,
        req.session.user._id,
        req.params.id
      );
      res.redirect(`/posts/postbyID/${post}`);
    } else {
      delete postFields.lostfoundDetails;
      // const postObj = {
      //   title: postFields.title,
      //   content: postFields.content,
      //   image: postFields.image,
      //   type: postFields.type,
      //   userID: postFields.userID,
      // };
      const post = await postData.updatePost(
        postFields,
        req.session.user._id,
        req.params.id
      );
      res.redirect(`/posts/postbyID/${post}`);
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.route("/general").get(async (req, res) => {
  try {
    const posts = await postData.getAllGeneralPosts();
    res.render("posts/general", { posts: posts });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/lost").get(async (req, res) => {
  try {
    const posts = await postData.getAllLFPosts();
    const postList = posts.filter((post) => post.type === "lost");
    res.render("posts/lostfound", { posts: postList, type: "Lost" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/found").get(async (req, res) => {
  try {
    const posts = await postData.getAllLFPosts();
    const postList = posts.filter((post) => post.type === "found");
    res.render("posts/lostfound", { posts: postList, type: "Found" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/add").get(async (req, res) => {
  res.render("posts/addPosts");
});

router.route("/add").post(upload, async (req, res) => {
  const postFields = {
    userID: req.session.user._id,
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    image: req.file,
    lostfoundDetails:
      req.body.type === "general"
        ? null
        : {
            location: req.body.details_location,
            date: req.body.details_date
              ? helpers.formatHTMLDate(req.body.details_date)
              : null,
            contact_info: req.body.details_contact,
            pet_details: {
              species: req.body.petdetails_species,
              breed: req.body.petdetails_breed,
              color: req.body.petdetails_color,
              other_details: req.body.petdetails_other,
            },
          },
  };
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

    if (
      !(
        postFields.type === "general" ||
        postFields.type === "lost" ||
        postFields.type === "found"
      )
    )
      throw `Type needs to be GENERAL or LOST or FOUND`;
    else {
      if (postFields.type === "lost" || postFields.type === "found") {
        if (!postFields.lostfoundDetails) throw `Must have Lost-Found Details.`;
        postFields.lostfoundDetails = helpers.postHelpers.islfdetailsValid(
          postFields.lostfoundDetails
        );
        if (postFields?.image === undefined) throw `Need Image.`;
      } else {
        if (postFields.lostfoundDetails)
          throw `General Post cannot have Lost-Found Details.`;
      }
    }
  } catch (e) {
    let errors = [];
    errors.push(e);
    return res.status(400).render("posts/addPosts", {
      hasErrors: true,
      errors: errors,
      postFields: postFields,
    });
  }

  try {
    if (postFields.type === "lost" || postFields.type === "found") {
      const postObj = {
        title: postFields.title,
        content: postFields.content,
        image: postFields.image,
        type: postFields.type,
        lostfoundDetails: postFields.lostfoundDetails,
        userID: postFields.userID,
      };
      const post = await postData.createPost(postObj);
      res.redirect(`/posts/postbyID/${post}`);
    } else {
      const postObj = {
        title: postFields.title,
        content: postFields.content,
        image: postFields.image,
        type: postFields.type,
        userID: postFields.userID,
      };
      const post = await postData.createPost(postObj);
      res.redirect(`/posts/postbyID/${post}`);
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
