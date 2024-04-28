import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const seedDatabase = async () => {
  const db = await dbConnection();
  const usersCollection = db.collection("users");
  const institutionsCollection = db.collection("institutions");
  db.dropDatabase();
  const users = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      gender: "Male",
      city: "New York",
      state: "NY",
      age: 25,
      hashedPassword: "password123",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      gender: "Female",
      city: "Los Angeles",
      state: "CA",
      age: 30,
      hashedPassword: "securepass456",
    },
  ];
  const institutions = [
    {
      name: "A2 Pet Services",
      email: "a2petservices@example.com",
      hashedPassword: "hashedPassword1",
      services: ["Grooming", "Veterinary Doctor"],
      address: "28 Laidlaw Ave",
      city: "Jersey City",
      state: "NJ",
    },
    {
      name: "B3 Animal Care",
      email: "b3animalcare@example.com",
      password: "hashedPassword2",
      services: ["Pet Training", "Pet Adoption"],
      address: "45 Main St",
      city: "New York",
      state: "NY",
    },
    {
      name: "C4 Pet Hospital",
      email: "c4pethospital@example.com",
      hashedPassword: "hashedPassword3",
      services: ["Veterinary Doctor", "Pet Surgery"],
      address: "123 Elm St",
      city: "Los Angeles",
      state: "CA",
    },
  ];

  await institutionsCollection.insertMany(institutions);

  //  await usersCollection.insertMany(users);

  console.log("Database seeded!");
  await closeConnection();
};

seedDatabase().catch(console.error);
