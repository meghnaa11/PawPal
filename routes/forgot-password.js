import { Router } from "express";
import { users, institutions } from "../config/mongoCollections.js";
import otpGenerator from "otp-generator";
import {
  sendOtpEmail,
  updatePassword,
  updateInstitutionPassword,
} from "../data/forgot-password.js";
const router = Router();

router.get("/userReset", async (req, res) => {
  return res.render("forgot-password");
});

router.get("/institutionReset", async (req, res) => {
  return res.render("forgot-password-institution");
});

router.get("/verify-otp", (req, res) => {
  res.render("verify-otp");
});

router.get("/update-password", (req, res) => {
  const email = req.query.email;
  res.render("update-password", { email: email });
});

router.get("/update-password-institution", (req, res) => {
  const email = req.query.email;
  res.render("update-password-institution", { email: email });
});

router.post("/user", async (req, res) => {
  const email = req.body.email;
  const userCollection = await users();

  const user = await userCollection.findOne({ email: email });
  if (user === null) {
    return res.render("forgot-password", {
      error: "No user with that email",
    });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: true,
    specialChars: false,
  });
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires after 10 minutes

  await userCollection.updateOne(
    { email: email },
    { $set: { otp: otp, otpExpiry: otpExpiry } }
  );

  await sendOtpEmail(email, otp);

  res.render("verify-otp", {
    message: "OTP sent to your email. Please check your email.",
    email: email,
  });
});

router.post("/institution", async (req, res) => {
  const email = req.body.email;
  const institutionCollection = await institutions();

  const institution = await institutionCollection.findOne({ email: email });
  if (institution === null) {
    return res.render("forgot-password-institution", {
      error: "No institution with that email",
    });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: true,
    specialChars: false,
  });
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires after 10 minutes

  await institutionCollection.updateOne(
    { email: email },
    { $set: { otp: otp, otpExpiry: otpExpiry } }
  );

  await sendOtpEmail(email, otp);

  res.render("verify-otp-institution", {
    message: "OTP sent to your email. Please check your email.",
    email: email,
  });
});

router.post("/verify-otp", async (req, res) => {
  console.log("verify otp called");
  const email = req.body.email;
  const otp = req.body.otp;

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });

  if (user === null) {
    return res.render("verify-otp", {
      error: "No user with that email",
    });
  }

  if (user.otp !== otp) {
    return res.render("verify-otp", {
      error: "Incorrect OTP",
    });
  }

  const now = new Date();
  if (now > user.otpExpiry) {
    return res.render("verify-otp", {
      error: "OTP has expired",
    });
  }

  res.redirect(
    `/forgotPassword/update-password?email=${encodeURIComponent(email)}`
  );
});

router.post("/update-password", async (req, res) => {
  console.log("update password called");
  const { newPassword, confirmPassword, email } = req.body;
  console.log(newPassword, confirmPassword, email);

  // Check if newPassword and confirmPassword are the same
  if (newPassword !== confirmPassword) {
    return res.render("update-password", {
      error: "Passwords do not match",
    });
  }

  try {
    // Update the user's password
    const success = await updatePassword(email, newPassword, confirmPassword);

    if (!success) {
      return res.render("update-password", {
        error: "Failed to update password",
      });
    }

    res.redirect("/userLogin");
  } catch (error) {
    // Render the update-password view with the error message
    res.render("update-password", { error: error.message });
  }
});

router.post("/update-password-institution", async (req, res) => {
  console.log("update institution password called");
  const { newPassword, confirmPassword, email } = req.body;
  console.log(newPassword, confirmPassword, email);

  // Check if newPassword and confirmPassword are the same
  if (newPassword !== confirmPassword) {
    return res.render("update-password-institution", {
      error: "Passwords do not match",
    });
  }

  try {
    // Update the institution's password
    const success = await updateInstitutionPassword(
      email,
      newPassword,
      confirmPassword
    );

    if (!success) {
      return res.render("update-password-institution", {
        error: "Failed to update password",
      });
    }

    res.redirect("/institutionLogin");
  } catch (error) {
    // Render the update-password-institution view with the error message
    res.render("update-password-institution", { error: error.message });
  }
});

router.post("/verify-otp-institution", async (req, res) => {
  console.log("verify otp for institution called");
  const email = req.body.email;
  const otp = req.body.otp;

  console.log(email, otp);

  const institutionCollection = await institutions();
  const institution = await institutionCollection.findOne({ email: email });

  if (institution === null) {
    return res.render("verify-otp-institution", {
      error: "No institution with that email",
    });
  }

  if (institution.otp !== otp) {
    return res.render("verify-otp-institution", {
      error: "Incorrect OTP",
    });
  }

  const now = new Date();
  if (now > institution.otpExpiry) {
    return res.render("verify-otp-institution", {
      error: "OTP has expired",
    });
  }

  res.redirect(
    `/forgotPassword/update-password-institution?email=${encodeURIComponent(
      email
    )}`
  );
});
export default router;
