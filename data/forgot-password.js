import ElasticEmail from "@elasticemail/elasticemail-client";
import bcrypt from "bcryptjs";
import { users,institutions } from "../config/mongoCollections.js";

export const sendOtpEmail = async (emailto, otp) => {
  console.log("sendOtpEmail method called");
  let defaultClient = ElasticEmail.ApiClient.instance;
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f7f7;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
        }
        .email-body {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>OTP Verification</h1>
        </div>
        <div class="email-body">
            <p>Dear User,</p>
            <p>You have requested to reset your password. Your One-Time Password (OTP) is:</p>
            <h2 style="text-align: center;">${otp}</h2>
            <p>Please enter this OTP to proceed with resetting your password. If you did not request a password reset, please ignore this email.</p>
            <p>Best regards,</p>
            <p>PawPal</p>
        </div>
    </div>
</body>
</html>
`;
  let apikey = defaultClient.authentications["apikey"];
  apikey.apiKey =
    "314E1C241D471622F74E7A0AF318D97DC78028739D4119EDD3D54009C0D6111EFB3BAA13359FE62176BE37425235529B";
  let api = new ElasticEmail.EmailsApi();
  let email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(emailto)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: htmlContent,
        }),
      ],
      Subject: "OTP Verification",
      From: "netcom333@gmail.com",
    },
  });
  var callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
    }
  };
  api.emailsPost(email, callback);
};

export const updatePassword = async (email, password, confirmPassword) => {
  console.log("updatePassword method called");
  console.log("email:", email);
  console.log("password:", password);

  password = password.trim();
  if (!/[A-Za-z]/.test(password)) {
    throw new Error("Password should contain at least one character");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password should contain at least one numeric character");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    throw new Error("Password should contain at least one special character");
  }
  if (!confirmPassword) {
    throw new Error("Please enter the password again");
  }
  if (confirmPassword.trim() === "") {
    throw new Error("Only empty spaces");
  }

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  console.log("user:", user);
  if (user === null) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 16);
  console.log("hashedPassword:", hashedPassword);

  const result = await userCollection.updateOne(
    { email: email },
    { $set: { hashedPassword: hashedPassword } }
  );
  console.log("update result:", result);

  return true;
};

export const updateInstitutionPassword = async (
  email,
  password,
  confirmPassword
) => {
  console.log("updateInstitutionPassword method called");
  console.log("email:", email);
  console.log("password:", password);

  password = password.trim();
  if (!/[A-Za-z]/.test(password)) {
    throw new Error("Password should contain at least one character");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password should contain at least one numeric character");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    throw new Error("Password should contain at least one special character");
  }
  if (!confirmPassword) {
    throw new Error("Please enter the password again");
  }
  if (confirmPassword.trim() === "") {
    throw new Error("Only empty spaces");
  }

  const institutionCollection = await institutions();
  const institution = await institutionCollection.findOne({ email: email });
  console.log("institution:", institution);
  if (institution === null) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 16);
  console.log("hashedPassword:", hashedPassword);

  const result = await institutionCollection.updateOne(
    { email: email },
    { $set: { hashedPassword: hashedPassword } }
  );
  console.log("update result:", result);

  return true;
};