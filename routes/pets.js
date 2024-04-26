import express from "express";
import { pets } from "../config/mongoCollections.js";
import { petData } from "../data/index.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/pets"); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generating unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("petImage");
router
  .route("/")
  .get(async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/userLogin");
      }
      res.render("pet_registration");
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(upload, async (req, res) => {
    try {
      const pet_info = req.body;
      const petImage = req.file;
      console.log(petImage);
      if (!pet_info || Object.keys(pet_info).length === 0) {
        return res
          .status(400)
          .json({ error: "There are no fields in the request body" });
      }
      pet_info.userID = req.session.user._id;
      // pet_info.userID = '661df71c507e73987a1eff95'
      if (
        !pet_info.name ||
        !pet_info.species ||
        !pet_info.breed ||
        !pet_info.description ||
        !pet_info.userID
      ) {
        res.send("Some fields are missing");
      }

      if (
        typeof pet_info.name !== "string" ||
        typeof pet_info.breed !== "string" ||
        typeof pet_info.species !== "string" ||
        typeof pet_info.description !== "string"
      ) {
        res.send("Some fields are not strings");
      }
      if (
        pet_info.name.trim() === "" ||
        pet_info.breed.trim() === "" ||
        pet_info.species.trim() === "" ||
        pet_info.description.trim() === ""
      ) {
        res.send("Some fields are only empty spaces");
      }
      if (!petImage) {
        return res.status(400).send("No file uploaded or file data missing");
      }
      const current_user = new ObjectId(pet_info.userID);
      const pet = await petData.addPets(
        pet_info.name,
        pet_info.species,
        pet_info.breed,
        pet_info.description,
        petImage,
        current_user
      );
      return res.redirect("/userDashboard");
    } catch (error) {
      return res.status(500).json(error);
    }
  });

router
  .route("/update/:id")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/userLogin");
    }
    try {
      const userID = req.session.user._id;
      const petID = req.params.id;
      const pet = await pets();
      const current_pet = await pet.findOne({ _id: new ObjectId(petID) });
      if (!current_pet) {
        res.send("Pet not found");
      }
      const user = await users();
      const current_user = await user.findOne({
        _id: new ObjectId(userID),
        pets: { $in: [petID] },
      });
      if (!current_user) {
        res.send("Pet not associated with user");
      }

      const pet_current_data = {
        name: current_pet.name,
        species: current_pet.species,
        breed: current_pet.breed,
        description: current_pet.description,
      };
      res.render("pet_update", { petID, pet_current_data });
    } catch (error) {
      res.status(404).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const petID = req.params.id;
      const updatedFields = req.body;
      const pet = await pets();
      const current_pet = await pet.findOne({ _id: new ObjectId(petID) });
      if (!current_pet) {
        res.send("Pet not found");
      }
      const pet_id_pass = new ObjectId(petID);
      const updatedPet = await petData.updatePetDetails(
        pet_id_pass,
        updatedFields
      );
      if (!updatedPet) {
        res.send("Update Failed");
      }
      res.redirect("/userdashboard");
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/view_pets/:id").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/userLogin");
  }
  const petID = req.params.id;
  const userID = req.session.user._id;
  if (!petID) {
    res.send("No Pet ID");
  }
  const isValidObjectpetId = ObjectId.isValid(petID);

  if (!isValidObjectpetId) {
    res.send("Invalid Object ID");
  }
  const user = await users();
  const current_user = await user.findOne({
    _id: new ObjectId(userID),
    pets: { $in: [petID] },
  });
  if (!current_user) {
    res.send("Pet not associated with user");
  }

  const display_pet_data = await petData.getPetDetails(petID);
  if (!display_pet_data) {
    res.send("Pet not found");
  }
  let img_path = display_pet_data.profileImage.path;
  console.log(img_path);
  const normalizedPath = path.normalize(img_path);
  res.render("view_pets", { petID, display_pet_data, normalizedPath });
});

router.route("/delete/:id").get(async (req, res) => {
  const pet_id = req.params.id;
  const user_id = req.session.user._id;
  if (!pet_id) {
    res.send("No Pet ID");
  }
  if (!user_id) {
    res.send("No User ID");
  }
  const isValidObjectpetId = ObjectId.isValid(pet_id);
  if (!isValidObjectpetId) {
    res.send("Invalid Object ID");
  }
  const isValidObjectuserId = ObjectId.isValid(user_id);
  if (!isValidObjectuserId) {
    res.send("Invalid Object ID");
  }
  const delete_pet = await petData.deletePet(pet_id, user_id);
  if (!delete_pet) {
    res.send("Couldnot Delete pet");
  }
  res.redirect("/userDashboard");
});

export default router;
