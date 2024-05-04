import { ObjectId } from "mongodb";

/*
Available Functions:

validators   ----->  checkID, checkString, checkObject, checkValidDate (format - mm/dd/yyyy)
getCurrentDateTime  (format - mm/dd/yyyy@hh:mm:ss)
posthelpers  ----->  all the validations for post data



*/

export const validators = {
  checkString: (variable, variableName) => {
    if (!variable) throw `${variableName || "Input"} must be provided`;
    if (typeof variable !== "string")
      throw `${variableName || "Input"} must be string`;
    variable = variable.trim();
    if (variable.length === 0)
      throw `${variableName || "Input"} should not be empty`;
    return variable;
  },

  checkId: (id) => {
    if (!id) throw `Must provide a ID`;
    if (typeof id !== "string") throw `ID must be a string`;
    id = id.trim();
    if (id.length === 0) throw `ID cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Invalid object ID`;
    return id;
  },

  checkObject: (variable, variableName) => {
    if (typeof variable !== "object")
      throw `${variableName || "Input"} must be Object`;
    if (Object.keys(variable).length === 0)
      throw `${variableName || "Input"} should not be empty`;
    return variable;
  },

  isValidContactNumber: (contactNumber) => {
    var regex = /^\d{10}$/;
    if (!regex.test(contactNumber)) throw "Invalid Contact";
  },

  checkValidDate: (dateReleased) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    const todayDate = new Date();
    if (!dateRegex.test(dateReleased)) throw `Invalid Date Format`;
    if (isNaN(Date.parse(dateReleased))) throw `Invalid Date`;
    if (Date.parse(dateReleased) > Date.parse(todayDate))
      throw `Date cannot be a future date`;
    const assumedDate = new Date(dateReleased);
    let parts = dateReleased.split("/");
    let day = parseInt(parts[1]);
    if (assumedDate.getDate() !== day) throw `Invalid Date`;
  },
};

export const postHelpers = {
  istitleValid: (title) => {
    title = validators.checkString(title, "Title");
    return title;
  },

  iscontentValid: (content) => {
    content = validators.checkString(content, "Content");
    return content;
  },

  istypeValid: (type) => {
    type = validators.checkString(type, "Type");
    if (
      !(
        type.toLowerCase() === "general" ||
        type.toLowerCase() === "lost" ||
        type.toLowerCase() === "found"
      )
    )
      throw `Type must be either General OR Lost OR Found`;
    return type.toLowerCase();
  },

  islfdetailsValid: (lostfoundDetails) => {
    lostfoundDetails = validators.checkObject(lostfoundDetails, "Details");

    if (lostfoundDetails?.location === undefined) throw `Must Provide Location`;
    lostfoundDetails.location = validators.checkString(
      lostfoundDetails.location,
      "Location"
    );

    if (lostfoundDetails?.date === undefined) throw `Must Provide Date`;
    lostfoundDetails.date = validators.checkString(
      lostfoundDetails.date,
      "Date"
    );
    validators.checkValidDate(lostfoundDetails.date);

    if (lostfoundDetails?.contact_info === undefined)
      throw `Must Provide Contact Info`;
    lostfoundDetails.contact_info = validators.checkString(
      lostfoundDetails.contact_info,
      "Contact"
    );
    validators.isValidContactNumber(lostfoundDetails.contact_info);

    if (lostfoundDetails?.pet_details === undefined)
      throw `Must Provide Pet Details`;
    lostfoundDetails.pet_details = validators.checkObject(
      lostfoundDetails.pet_details,
      "Pet Details"
    );

    if (lostfoundDetails.pet_details?.species === undefined)
      throw `Must Provide Pet Species`;
    lostfoundDetails.pet_details.species = validators.checkString(
      lostfoundDetails.pet_details.species,
      "Pet Species"
    );
    if (lostfoundDetails.pet_details?.breed === undefined)
      lostfoundDetails.pet_details.breed = validators.checkString(
        lostfoundDetails.pet_details.breed,
        "Pet Breed"
      );
    if (lostfoundDetails.pet_details?.color === undefined)
      throw `Must Provide Pet Color`;
    lostfoundDetails.pet_details.color = validators.checkString(
      lostfoundDetails.pet_details.color,
      "Pet Color"
    );
    if (lostfoundDetails.pet_details?.other_details === undefined)
      throw `Must Provide Pet Details`;
    lostfoundDetails.pet_details.other_details = validators.checkString(
      lostfoundDetails.pet_details.other_details,
      "Pet Details"
    );

    return {
      location: lostfoundDetails.location,
      date: lostfoundDetails.date,
      contact_info: lostfoundDetails.contact_info,
      pet_details: {
        species: lostfoundDetails.pet_details.species,
        breed: lostfoundDetails.pet_details.breed,
        color: lostfoundDetails.pet_details.color,
        other_details: lostfoundDetails.pet_details.other_details,
      },
    };
  },

  isuserIDValid: (userID) => {
    userID = validators.checkId(userID);
    return userID;
  },
};

export const getCurrentDateTime = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year}@${hours}:${minutes}:${seconds}`;
};

export function formatHTMLDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

export function formatJSDate(dateString) {
  const [month, date, year] = dateString.split("/");
  return `${year}-${month}-${date}`;
}
