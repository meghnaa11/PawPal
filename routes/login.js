import { Router } from "express";
const router = Router();
import { loginData, userData, institutionData } from "../data/index.js";


router.get("/", async (req, res) => {
  return res.render("loginType", { page_title: "Login Type" });
});

router.get("/userDashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/userLogin");
  }

  const user = await userData.getUserById(req.session.user._id);
  // const user = await userCollection.findOne({ email: req.session.user.email });

  res.render("userDashboard", { user });
});

router.get("/institutionDashboard", async (req, res) => {
  if (!req.session.institution) {
    return res.redirect("/institutionLogin");
  }
  try {
    const institution = await institutionData.getInstitutionById(
      req.session.institution._id
    );
    res.render("institutionDashboard", { institution });
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
      return res.redirect("/userDashboard");
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
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
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

export default router;
