import fs from 'fs'
import express from "express";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { userData } from "../data/index.js";
import multer from 'multer'
import path from 'path'
import { ObjectId } from "mongodb";
import {users} from "../config/mongoCollections.js"
import { config } from 'process';
// const __dirname = path.resolve();


const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/users'); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generating unique filename
  }
});

const upload = multer({    
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  
}).single('profileImage'); 

const upload_update = multer({    
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  
}).single('updated_profile_pic');

router
  .route("/")
  .get(async (req, res) => {
    try {
      res.render("user_registration", { page_title: "User Registration" });
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(upload ,async (req, res) => {
    try {
      const user_info = req.body;
      const profileImage = req.file
   

      if (!user_info || Object.keys(user_info).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      if (!user_info || Object.keys(user_info).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      if (!user_info.password) {
        return res.status(400).send("Password Not Entered"); // Changed res.send to res.status(400).send
      }
      if (!user_info.password) {
        return res.status(400).send("Password Not Entered");
      }
      if (user_info.password.trim() === "") {
        return res.status(400).send("Only empty spaces");
      }
      if (user_info.password.length < 8) {
        return res
          .status(400)
          .send("Minimum 8 characters required for password");
      }
      user_info.password = user_info.password.trim();
      if (!/[A-Za-z]/.test(user_info.password)) {
        return res.status(400).send("Should contain atleast one character");
      }
      if (!/\d/.test(user_info.password)) {
        return res
          .status(400)
          .send("Should contain atleast one numeric character");
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(user_info.password)) {
        return res
          .status(400)
          .send("Should contain atleast one special character");
      }
      if (!user_info.confirmPassword) {
        return res.status(400).send("Please enter the password again");
      }
      if (user_info.confirmPassword.trim() === "") {
        return res.status(400).send("Only empty spaces");
      }
      if (user_info.password !== user_info.confirmPassword) {
        return res.status(400).send("Passwords donot match");
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user_info.password || "", salt);
      const confirmhashPassword = await bcrypt.hash(
        user_info.confirmPassword || "",
        salt
      );
      if (!hashPassword || !confirmhashPassword) {
        return res.status(400).send("Failed to hash password");
      }

      if (
        !user_info.firstName ||
        !user_info.lastName ||
        !user_info.email ||
        !user_info.state ||
        !user_info.city ||
        !user_info.gender ||
        !user_info.age
      ) {
        return res.status(400).send("Some fields are missing");
      }
      if (
        typeof user_info.firstName !== "string" ||
        typeof user_info.lastName !== "string" ||
        typeof user_info.email !== "string" ||
        typeof user_info.state !== "string" ||
        typeof user_info.city !== "string" ||
        typeof user_info.gender !== "string"
      ) {
        return res.status(400).send("Some fields are not strings");
      }
      if (!profileImage) {
        return res.status(400).send("No file uploaded or file data missing");
      }

      const user = await userData.userRegistration(
        user_info.firstName,
        user_info.lastName,
        user_info.email,
        user_info.gender,
        user_info.city,
        user_info.state,
        parseInt(user_info.age),
        hashPassword,
        confirmhashPassword,
        profileImage
      );
      if(!user){
        return res.status(404).send("Unable to adduser");
      }
      
     // const imagePath = new URL('./public/images/user/', import.meta.url).pathname;
      // const imagePathString = path.join(imagePath, profileImage.originalname);
      // const imagePath = path.join(process.cwd(),'.','public/images/user/',profileImage.originalname);
      // console.log(imagePath)
      // const writeStream = fs.createWriteStream(imagePath);
      // writeStream.write(profileImage.buffer);
      // writeStream.end();
      return res.redirect("/userLogin");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await userData.getUserById(id);
//     console.log(user.profileImage)

//     res.json(user);
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

router.post("/update/:id", upload,async (req, res) => {

  try {
    if (!req.session.user) {
      return res.redirect("/userLogin");
    }

    const updatedUser = req.body;
    const id = req.params.id;
    const result = await userData.updateUser(id, updatedUser);
    if (result === null) {
      return res.status(404).json({ error: "User not found" });
    }
    res.redirect("/userDashboard");
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

router.get("/update/:id", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/userLogin");
    }
    const id = req.params.id;
    const user = await userData.getUserById(id);
    res.render("updateUser", { user });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});
router.route("/update/image/:id").post(upload_update, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/userLogin");
    }
    const id = req.params.id;
    const image = req.file;
    console.log(image)
    const user = await userData.getUserById(id);
    if(!user){
      res.status(404).json({ error: e.toString() });
    }
    console.log(user)
    const user_collection = await users()
    const updated_image = await user_collection.updateOne(
      { _id: new ObjectId(id) },  
      { $set: { profileImage: image } } 
    );
    console.log(updated_image)
  

    res.redirect("/userDashboard");
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});


export default router;
