import { appointments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import ElasticEmail from '@elasticemail/elasticemail-client';

export const sendEmail = async (emailto, name, date, time, service) => {
  let defaultClient = ElasticEmail.ApiClient.instance;
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Appointment Confirmation</title>
<style>
    body { font-family: Arial, sans-serif; }
    .header { background-color: #f2f2f2; padding: 10px; text-align: center; }
    .content { margin: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
    .footer { margin-top: 20px; text-align: center; font-size: 0.8em; color: #777; }
</style>
</head>
<body>
<div class="header">
    <h1>PawPal Pet Care Service Appointment Confirmation</h1>
</div>
<div class="content">
    <p>Hello ${name},</p>
    <p>Thank you for booking an appointment with our pet care service. Here are the details of your upcoming appointment:</p>
    <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Service:</strong> ${service}</li>
    </ul>
    <p>Please review our checklist before your appointment:</p>
    <ol>
        <li>Updated vaccinations</li>
        <li>Health records and medical info</li>
        <li>Behavioral assessment if required</li>
        <li>Parasite prevention</li>
        <li>ID tags or microchip</li>
        <li>Spay/neuter confirmation</li>
        <li>Diet and medication instructions</li>
        <li>Emergency contact information</li>
        <li>Signed liability waiver</li>
        <li>Adherence to scheduled times</li>
    </ol>
    <p>If you have any questions or need to update your appointment details, please contact us at PawPal.</p>
    <p>We look forward to seeing you and your pet!</p>
</div>
<div class="footer">
    <p>Thank you,<br>Your Pet Care Team</p>
</div>
</body>
</html>
`;
  let apikey = defaultClient.authentications['apikey'];
  apikey.apiKey = "314E1C241D471622F74E7A0AF318D97DC78028739D4119EDD3D54009C0D6111EFB3BAA13359FE62176BE37425235529B"
  let api = new ElasticEmail.EmailsApi()
  let email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [
      new ElasticEmail.EmailRecipient(emailto)
    ],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: htmlContent
        })
      ],
      Subject: "Appointmnet Confirmation for PawPal Pet Care Service",
      From: "netcom333@gmail.com"
    }
  });
  var callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
    }
  };
  api.emailsPost(email, callback);

};

export const create = async (
  category,
  time,
  desc,
  institutionID,
  userID,
  petID
) => {
  if (!category || !time || !desc || !institutionID || !userID || !petID) {
    throw "All fields need to be supplied";
  }
  // if (typeof desc !== 'string' || typeof institutionID !== 'string' || typeof userID !== 'string' || typeof petID !== 'string') {
  //  throw 'input not strings'
  // }

  desc = desc.trim();

  if (
    desc.length === 0 ||
    institutionID.length === 0 ||
    userID.length === 0 ||
    petID.length === 0
  ) {
    throw "input cannot be empty";
  }

  // if (typeof institutionID !== 'string' || !ObjectId.isValid(institutionID)) throw 'Invalid institutionID';
  // if (typeof userID !== 'string' || !ObjectId.isValid(userID)) throw 'Invalid userID';
  // if (typeof petID !== 'string' || !ObjectId.isValid(petID)) throw 'Invalid petID';

  const appointmentCollection = await appointments();
  const newAppointment = {
    category: category,
    appointment_time: new Date(time),
    description: desc,
    institutionID,
    userID,
    petID,
  };

  const insertInfo = await appointmentCollection.insertOne(newAppointment);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add appointment";

  // const userCollection = await users();
  // const userinfosUpdate = await userCollection.findOneAndUpdate(
  //   { _id: new ObjectId(userID) },
  //   { $push: { appointments: insertInfo.insertedId.toString() } },
  //   { returnDocument: "after" }
  // );
  // const institutionCollection = await institutions();
  // const institutionUpdate = await institutionCollection.findOneAndUpdate(
  //   { _id: new ObjectId(institutionID) },
  //   { $push: { appointments: insertInfo.insertedId.toString() } },
  //   { returnDocument: "after" }
  // );
  // if (!userinfosUpdate || !institutionUpdate) throw "Could not add appointment";

  return await get(insertInfo.insertedId.toString());
};

export const getAllByUserId = async (id) => {
  if (!id) {
    throw "id not supplied";
  }
  if (typeof id !== "string") {
    throw "id not a string";
  }
  if (id.trim().length === 0) {
    throw "id cannot be empty";
  }
  if (!ObjectId.isValid(id)) throw "Invalid id";

  const appointmentCollection = await appointments();
  const applist = await appointmentCollection.find({ userID: id }).toArray();

  return applist;
};

export const getAllByInsId = async (id) => {
  if (!id) {
    throw "id not supplied";
  }
  if (typeof id !== "string") {
    throw "id not a string";
  }
  if (id.trim().length === 0) {
    throw "id cannot be empty";
  }
  if (!ObjectId.isValid(id)) throw "Invalid id";

  const appointmentCollection = await appointments();
  const applist = await appointmentCollection.find({
    institutionID: id
  }).toArray();

  return applist;


};

export const get = async (id) => {
  if (!id) {
    throw "id not supplied";
  }
  if (typeof id !== "string") {
    throw "id not a string";
  }
  if (id.trim().length === 0) {
    throw "id cannot be empty";
  }
  if (!ObjectId.isValid(id)) throw "Invalid id";

  const appointmentCollection = await appointments();
  const appointment = await appointmentCollection.findOne({
    _id: new ObjectId(id),
  });

  if (appointment === null) throw "No appointment with that id";
  return appointment;
};

export const remove = async (id) => {
  if (!id) {
    throw "id not supplied";
  }
  if (typeof id !== "string") {
    throw "id not a string";
  }
  if (id.trim().length === 0) {
    throw "id cannot be empty";
  }
  if (!ObjectId.isValid(id)) throw "Invalid id";

  const appointmentCollection = await appointments();
  const appointment = await get(id);

  const deletionInfo = await appointmentCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (deletionInfo.deletedCount === 0) {
    return { deleted: false };
  }

  return { deleted: true };
};
