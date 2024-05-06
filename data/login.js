import { users, institutions } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";

const exportedMethods = {
  async userLogin(email, password) {
    console.log("userLogin method called");
    const userData = await users();
    const user = await userData.findOne({ email: email.toLowerCase() });
    console.log(user);

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      return user;
    } else {
      console.log("Incorrect password or user not found");
      return null;
    }
  },
  async institutionLogin(email, password) {
    console.log("institutionLogin method called");
    const institutionData = await institutions();
    const institution = await institutionData.findOne({
      email: email.toLowerCase(),
    });
    console.log(institution);

    if (
      institution &&
      (await bcrypt.compare(password, institution.hashedPassword))
    ) {
      return institution;
    } else {
      console.log("Incorrect password or institution not found");
      return null;
    }
  },
};

export default exportedMethods;
