import express from "express";
import { institutionData } from "../data/index.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { institutions } from "../config/mongoCollections.js";
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/institutions'); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generating unique filename
  }
});

const upload = multer({    
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  
}).single('instituteImage'); 

const upload_update = multer({    
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  
}).single('updated_profile_pic'); 


router
  .route("/")
  .get(async (req, res) => {
    try {
      res.render("institution_registration", {
        page_title: "institution Registration",
      });
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(upload, async (req, res) => {
    try {
      const institute_info = req.body;
      const instituteImage = req.file;
      if (!institute_info || Object.keys(institute_info).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      if (!institute_info.hashedPassword) {
        res.send("Password Not Entered");
      }
      if (institute_info.hashedPassword.trim() === "") {
        res.send("Only empty spaces");
      }
      if (institute_info.hashedPassword.length < 8) {
        return res.send("Minimum 8 characters required for password");
      }
      institute_info.hashedPassword = institute_info.hashedPassword.trim();
      if (!/[A-Za-z]/.test(institute_info.hashedPassword)) {
        res.send("Should contain atleast one character");
      }
      if (!/\d/.test(institute_info.hashedPassword)) {
        res.send("Should contain atleast one numeric character");
      }
      if (
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
          institute_info.hashedPassword
        )
      ) {
        res.send("Should contain atleast one special character");
      }
      if (!institute_info.confirmhashedPassword) {
        res.send("Please enter the password again");
      }
      if (institute_info.confirmhashedPassword.trim() === "") {
        res.send("Only empty spaces");
      }
      if (
        institute_info.hashedPassword !== institute_info.confirmhashedPassword
      ) {
        res.send("Passwords donot match");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(
        institute_info.hashedPassword || "",
        salt
      );
      const confirmhashPassword = await bcrypt.hash(
        institute_info.confirmhashedPassword || "",
        salt
      );
      if (!hashPassword || !confirmhashPassword) {
        res.send("Failed to hash password");
      }
      if (
        !institute_info.name ||
        !institute_info.email ||
        !institute_info.state ||
        !institute_info.city ||
        !institute_info.address
      ) {
        res.send("Some fields are missing");
      }
      if (
        typeof institute_info.name !== "string" ||
        typeof institute_info.email !== "string" ||
        typeof institute_info.state !== "string" ||
        typeof institute_info.city !== "string" ||
        typeof institute_info.address !== "string"
      ) {
        res.send("Some fields are not strings");
      }
      if (!Array.isArray(institute_info.services)) {
        res.send("Services should be of type array");
      }
      for (let i = 0; i < institute_info.services.length; i++) {
        if (institute_info.services[i].trim() === "") {
          res.send("Only empty spaces not allowed");
        }
      }
      if (!instituteImage) {
        return res.status(400).send("No file uploaded or file data missing");
      }
      const institution = await institutionData.institutionRegistration(
        institute_info.name,
        institute_info.email,
        institute_info.services,
        institute_info.address,
        institute_info.city,
        institute_info.state,
        hashPassword,
        confirmhashPassword,
        instituteImage
      );
      return res.redirect("/institutionLogin");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

router.route("/dashboard").get(async (req, res) => {
  try {
    res.render("institution_dashboard");
  } catch (error) {
    res.status(404).json(error);
  }
});

router
  .route("/update/:id")
  .get(async (req, res) => {
    try {
if (!req.session.institution) {
  return res.redirect("/institutionLogin");
}

const sessionInstitutionID = req.session.institution._id;
const passedInstitutionID = req.params.id;

if (passedInstitutionID !== sessionInstitutionID) {
  // If they don't match, send a message indicating the invalid institution update attempt
  return res.send("You are trying to update an invalid institution");
}

      // institutionID = new Object(institutionID);
      // console.log(institutionID)
      const institution = await institutions();
      const current_institution = await institution.findOne({
        _id: new ObjectId(sessionInstitutionID),
      });

      if (!current_institution) {
        res.send("Institution not found");
      }
      const institution_current_data = {
        id: sessionInstitutionID,
        name: current_institution.name,
        email: current_institution.email,
        services: current_institution.services,
        address: current_institution.address,
        city: current_institution.city,
        state: current_institution.state,
      };
      res.render("institution_update", {
        institution_current_data,
        page_title: "Update Institution",
      });
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      if (!req.session.institution) {
        // If there's no institution in the session, redirect to the login page
        return res.redirect("/institutionLogin");
      }
      const institutionID = req.params.id;
      const updatedFields = req.body;
      const institution = await institutions();
      const current_institution = await institution.findOne({
        _id: new ObjectId(institutionID),
      });
      if (!current_institution) {
        res.send("Institution not found");
      }
      const institution_id_pass = new ObjectId(institutionID);
      const updatedInstitution = await institutionData.updateInstitutionDetails(
        institution_id_pass,
        updatedFields
      );
      if (!updatedInstitution) {
        res.send("Update Failed");
      }
      // return res.status(200).json(updatedInstitution);
      return res.redirect("/institutionDashboard");
    } catch (error) {
      const id = req.params.id;
      const institution = await institutions();
      const current_institution = await institution.findOne({
        _id: new ObjectId(id),
      });
      const institution_current_data = {
        id: req.params.id,
        name: current_institution.name,
        email: current_institution.email,
        services: current_institution.services,
        address: current_institution.address,
        city: current_institution.city,
        state: current_institution.state,
      };
      return res.status(500).render("institution_update", { error:error, institution_current_data });
      // return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.route("/update/image/:id").post(upload_update, async (req, res) => {
    try {
      if (!req.session.institution) {
        return res.redirect("/institutionLogin");
      }
      const id = req.params.id;
      const image = req.file;
      console.log(image)
      const institution = await institutions();
      const current_institution = await institution.findOne({
        _id: new ObjectId(id),
      });
      if(!current_institution){
        res.status(404).json({ error: e.toString() });
      }
      const updated_image = await institution.updateOne(
        { _id: new ObjectId(id) },  
        { $set: { profileImage: image } } 
      );
      console.log(updated_image)
    
  
      res.redirect("/institutionDashboard");
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });

export default router;
