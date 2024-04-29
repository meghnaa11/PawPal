import { Router } from "express";
const router = Router();

import * as postData from "../data/posts.js";
import * as helpers from "../helper.js";

router.route("/myposts").get(async (req, res) => {
  try {
    const postbyID = await postData.getmyPosts("65d69f9de5cf3db66f90a055");
    res.render("posts/viewmyPosts", { posts: postbyID });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/general/:id").get(async (req, res) => {
  try {
    const postbyID = await postData.getPostsbyID(req.params.id);
    res.render("posts/viewPost", { post: postbyID });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/general/").get(async (req, res) => {
  try {
    const posts = await postData.getAllGeneralPosts();
    res.render("posts/general", { posts: posts });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/lostfound/").get(async (req, res) => {
  try {
    const posts = await postData.getAllLFPosts();
    res.render("posts/lostfound", { posts: posts });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.route("/add").get(async (req, res) => {
  res.render("posts/addPosts");
});

router.route("/add").post(async (req, res) => {
  const postFields = {
    userID: "66245038357c972a730d1221",
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    image: req.body.image,
    lostfoundDetails:
      req.body.type === "general"
        ? null
        : {
            location: req.body.details_location,
            date: "08/12/2023", //req.body.details_date,
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
    } else {
      const postObj = {
        title: postFields.title,
        content: postFields.content,
        image: postFields.image,
        type: postFields.type,
        userID: postFields.userID,
      };
      const post = await postData.createPost(postObj);
      return res.json(post);
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

// router.route("/general/add").post(async (req, res) => {
//   const postFields = req.body;
//   if (!postFields || Object.keys(postFields).length === 0) {
//     return res
//       .status(400)
//       .json({ error: "There are no fields in the request body" });
//   }

//   try {
//     if (postFields?.userID === undefined) throw `Need User ID.`;
//     postFields.userID = helpers.postHelpers.isuserIDValid(postFields.userID);
//     if (postFields?.title === undefined) throw `Title needs to be Provided.`;
//     if (postFields?.content === undefined)
//       throw `Content needs to be Provided.`;
//     if (postFields?.type === undefined) throw `Type needs to be Provided.`;

//     postFields.title = helpers.postHelpers.istitleValid(postFields.title);
//     postFields.content = helpers.postHelpers.iscontentValid(postFields.content);
//     postFields.type = helpers.postHelpers.istypeValid(postFields.type);

//     if (!(postFields.type === "general")) throw `Type needs to be GENERAL`;
//     else {
//       if (postFields.lostfoundDetails)
//         throw `General Post cannot have Lost-Found Details.`;
//     }
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }

//   try {
//     const postObj = {
//       title: postFields.title,
//       content: postFields.content,
//       image: postFields.image,
//       type: postFields.type,
//       userID: postFields.userID,
//     };
//     const post = await postData.createPost(postObj);
//     return res.json(post);
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// });

export default router;
