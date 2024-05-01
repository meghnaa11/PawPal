import { Router } from "express";
import { pets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = Router();
import { loginData, userData, institutionData } from "../data/index.js";

router.get("/", async (req, res) => {
  return res.render("loginType", { page_title: "Login Type" });
});

router.get("/userDashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/userLogin");
  }
  const pet = await pets();
  const user = await userData.getUserById(req.session.user._id);
  const pet_names_array = [];
  // const user = await userCollection.findOne({ email: req.session.user.email });
  if (user.pets) {
    for (let i = 0; i < user.pets.length; i++) {
      let temp = await pet.findOne({ _id: new ObjectId(user.pets[i]) });
      if (!temp) {
        res.send("Error retrieving pets");
      }
      pet_names_array.push({ _id: temp._id, name: temp.name , image:temp.profileImage.filename});
    }
  }

  res.render("userDashboard", {
    user,
    page_title: "User Dashboard",
    pet_names_array,
  });
});

router.get("/institutionDashboard", async (req, res) => {
  if (!req.session.institution) {
    return res.redirect("/institutionLogin");
  }
  try {
    const institution = await institutionData.getInstitutionById(
      req.session.institution._id
    );
    res.render("institution_dashboard", {
      institution,
      page_title: "Institution Dashboard",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred while fetching the institution.");
  }
});

router.get("/userLogin", async (req, res) => {
  return res.render("userLoginPage", { page_title: "User Login" });
});

router.get("/institutionLogin", async (req, res) => {
  return res.render("institutionLogin", {
    page_title: "Institution Login",
  });
});

router.post("/user", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await loginData.userLogin(email, password);
    console.log(user);
    if (user) {
      req.session.user = {
        email: user.email,
        _id: user._id,
      };
      return res.redirect("/home");
    } else {
      return res.status(401).render("userLoginPage", { error: "Invalid Email or Password" });
    }
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/institution", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const institution = await loginData.institutionLogin(email, password);
    console.log(institution);
    if (institution) {
      req.session.institution = {
        name: institution.name,
        email: institution.email,
        _id: institution._id,
      };
      return res.redirect("/institutionDashboard");
    } else {
      return res.status(401).render("institutionLogin", { error: "Invalid Email or Password" });
    }
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

export default router;
