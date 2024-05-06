import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import bcrypt from "bcryptjs";
import { createPost } from "./data/posts.js";
import { ObjectId } from "mongodb";


// Password for all institutions and users is  User@123
const seedDatabase = async () => {
  const db = await dbConnection();
  const usersCollection = db.collection("users");
  const institutionsCollection = db.collection("institutions");
  const postsCollection = db.collection("posts");
  db.dropDatabase();

  const hashedPassword = await bcrypt.hash("User@123", 10);

  const users = [
    {
      firstName: "Yash",
      lastName: "Deshpande",
      email: "yash123@gmail.com",
      gender: "male",
      city: "Hoboken",
      state: "DE",
      age: 20,
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "profileImage",
        originalname: "user1.png",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/users",
        filename: "user1.png",
        path: "public\\assets\\users\\user1.png",
        size: 2607814,
      },
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    },
    {
      firstName: "Meghna",
      lastName: "Agarwal",
      email: "meghna123@gmail.com",
      gender: "male",
      city: "Dallas",
      state: "TX",
      age: 20,
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "profileImage",
        originalname: "user3.png",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/users",
        filename: "user3.png",
        path: "public\\assets\\users\\user3.png",
        size: 2607814,
      },
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    },
    {
      firstName: "Akshat",
      lastName: "Sahu",
      email: "akshat123@gmail.com",
      gender: "male",
      city: "Jersey City",
      state: "NJ",
      age: 23,
      hashedPassword:
        "$2a$10$DUgljFtXT5gE0I9QwNUWHuGWM0gdgTR6g47ZV4tDr1.zYRriM0HBS",
      profileImage: {
        fieldname: "profileImage",
        originalname: "user1.png",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/users",
        filename: "user1.png",
        path: "public\\assets\\users\\user1.png",
        size: 2607814,
      },
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    },
    {
      firstName: "Yichao",
      lastName: "Jiang",
      email: "yichao123@gmail.com",
      gender: "male",
      city: "Las Vegas",
      state: "NV",
      age: 20,
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "profileImage",
        originalname: "user2.png",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/users",
        filename: "user2.png",
        path: "public\\assets\\users\\user2.png",
        size: 2607814,
      },
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    },
    {
      firstName: "Vrund",
      lastName: "Patel",
      email: "vrund123@gmail.com",
      gender: "male",
      city: "Scranton",
      state: "AL",
      age: "23",
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "profileImage",
        originalname: "user1.png",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/users",
        filename: "user1.png",
        path: "public\\assets\\users\\user1.png",
        size: 2607814,
      },
      pets: [],
      posts: [],
      reviews: [],
      comments: [],
    },
  ];

  const insertedUsers = await usersCollection.insertMany(users);
  console.log(insertedUsers.insertedIds);

  const institutions = [
    {
      name: "Bruno Pet Service",
      email: "institution1@gmail.com",
      services: ["Grooming", "Veterinary Doctor"],
      address: "123 Downtown St",
      city: "Las Vegas",
      state: "CA",
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "instituteImage",
        originalname: "1238013.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/institutions",
        filename: "paw.jpg",
        path: "public\\assets\\institutions\\paw.jpg",
        size: 1819128,
      },
    },
    {
      name: "Tom Pet Service",
      email: "institution2@gmail.com",
      services: ["Veterinary Doctor", "Pet Surgery"],
      address: "123 Downtown St",
      city: "Las Vegas",
      state: "TX",
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "instituteImage",
        originalname: "1238013.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/institutions",
        filename: "paw.jpg",
        path: "public\\assets\\institutions\\paw.jpg",
        size: 1819128,
      },
    },
    {
      name: "Jerry Pet Service",
      email: "institution3@gmail.com",
      services: ["Daycare", "Pet Sitting and Walking"],
      address: "123 Downtown St",
      city: "Las Vegas",
      state: "NJ",
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "instituteImage",
        originalname: "1238013.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/institutions",
        filename: "paw.jpg",
        path: "public\\assets\\institutions\\paw.jpg",
        size: 1819128,
      },
    },
    {
      name: "Scooby Pet Service",
      email: "institution4@gmail.com",
      services: ["Veterinary Doctor", "Daycare", "Pet Surgery"],
      address: "123 Downtown St",
      city: "Las Vegas",
      state: "PA",
      hashedPassword: hashedPassword,
      profileImage: {
        fieldname: "instituteImage",
        originalname: "1238013.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "./public/assets/institutions",
        filename: "paw.jpg",
        path: "public\\assets\\institutions\\paw.jpg",
        size: 1819128,
      },
    },
  ];

  const insertedInstitutions = await institutionsCollection.insertMany(
    institutions
  );
  console.log(insertedInstitutions.insertedIds);

  const lostpost1 = {
    userID: insertedUsers.insertedIds[0].toString(),
    title: "Lost Dog Named Max",
    content:
      "Max went missing around the neighborhood park. He's a friendly Golden Retriever.",
    type: "lost",
    image: {
      fieldname: "image",
      originalname: "goldenretriever.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "goldenretriever.jpeg",
      path: "public\\assets\\posts\\goldenretriever.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Central Park, New York",
      date: "05/01/2024",
      contact_info: "5551234567",
      pet_details: {
        species: "Dog",
        breed: "Golden Retriever",
        color: "Golden",
        other_details: "Wearing a blue collar with a tag.",
      },
    },
  };

  const lostpost2 = {
    userID: insertedUsers.insertedIds[1].toString(),
    title: "Missing Cat Luna",
    content:
      "Luna is a black and white cat. She has a distinctive black spot on her left ear.",
    type: "lost",
    image: {
      fieldname: "image",
      originalname: "domesticcat.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "domesticcat.jpeg",
      path: "public\\assets\\posts\\domesticcat.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Oak Street, Los Angeles",
      date: "04/30/2024",
      contact_info: "5559876543",
      pet_details: {
        species: "Cat",
        breed: "Domestic Short Hair",
        color: "Black and White",
        other_details: "Very shy but responds to her name.",
      },
    },
  };

  const lostpost3 = {
    userID: insertedUsers.insertedIds[2].toString(),
    title: "Lost Parrot Charlie",
    content:
      "Charlie, our African Grey Parrot, flew out of the window. He's quite talkative.",
    type: "lost",
    image: {
      fieldname: "image",
      originalname: "africanparrot.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "africanparrot.jpeg",
      path: "public\\assets\\posts\\africanparrot.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Maple Avenue, Chicago",
      date: "05/02/2024",
      contact_info: "5552345678",
      pet_details: {
        species: "Parrot",
        breed: "African Grey",
        color: "Grey",
        other_details:
          "Speaks several phrases including 'Hello' and 'Want a cracker?'",
      },
    },
  };
  const lostpost4 = {
    userID: insertedUsers.insertedIds[3].toString(),
    title: "Missing Rabbit Snowball",
    content:
      "Snowball is a white rabbit with blue eyes. She's an indoor rabbit who escaped through a hole in the fence.",
    type: "lost",
    image: {
      fieldname: "image",
      originalname: "dwarfrabbit.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "dwarfrabbit.jpeg",
      path: "public\\assets\\posts\\dwarfrabbit.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Willow Street, Seattle",
      date: "05/03/2024",
      contact_info: "5553456789",
      pet_details: {
        species: "Rabbit",
        breed: "Netherland Dwarf",
        color: "White",
        other_details: "Wearing a pink collar with a bell.",
      },
    },
  };
  const lostpost5 = {
    userID: insertedUsers.insertedIds[4].toString(),
    title: "Lost Ferret Gizmo",
    content:
      "Gizmo, our friendly ferret, slipped out of his cage during cleaning.",
    type: "lost",
    image: {
      fieldname: "image",
      originalname: "ferret.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "ferret.jpeg",
      path: "public\\assets\\posts\\ferret.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Pine Street, San Francisco",
      date: "05/04/2024",
      contact_info: "5554567890",
      pet_details: {
        species: "Ferret",
        breed: "Standard",
        color: "Brown",
        other_details: "Loves to hide in small places.",
      },
    },
  };

  const post1ID = await createPost(lostpost1);
  console.log(post1ID);
  const post2ID = await createPost(lostpost2);
  console.log(post2ID);
  const post3ID = await createPost(lostpost3);
  console.log(post3ID);
  const post4ID = await createPost(lostpost4);
  console.log(post4ID);
  const post5ID = await createPost(lostpost5);
  console.log(post5ID);

  const foundpost1 = {
    userID: insertedUsers.insertedIds[4].toString(),
    title: "Happy Reunion with Max",
    content:
      "We found Max happily playing with other dogs in the park. He seems to have made some new friends during his adventure!",
    type: "found",
    image: {
      fieldname: "image",
      originalname: "goldenretriever.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "goldenretriever.jpeg",
      path: "public\\assets\\posts\\goldenretriever.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Central Park, New York",
      date: "05/02/2024",
      contact_info: "5551112222",
      pet_details: {
        species: "Dog",
        breed: "Golden Retriever",
        color: "Golden",
        other_details: "Found playing joyfully with other dogs.",
      },
    },
  };

  const foundpost2 = {
    userID: insertedUsers.insertedIds[2].toString(),
    title: "Luna Safely Rescued",
    content:
      "We discovered Luna hiding in a neighbor's shed. She seemed scared but relieved to be found.",
    type: "found",
    image: {
      fieldname: "image",
      originalname: "domesticcat.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "domesticcat.jpeg",
      path: "public\\assets\\posts\\domesticcat.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Oak Street, Los Angeles",
      date: "05/03/2024",
      contact_info: "5553334444",
      pet_details: {
        species: "Cat",
        breed: "Domestic Short Hair",
        color: "Black and White",
        other_details: "Found hiding in the shed, scared but safe.",
      },
    },
  };

  const foundpost3 = {
    userID: insertedUsers.insertedIds[1].toString(),
    title: "Charlie Found!",
    content:
      "We spotted Charlie perched on a tree branch in the backyard. After some coaxing, he flew down and landed on our shoulders!",
    type: "found",
    image: {
      fieldname: "image",
      originalname: "africanparrot.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "africanparrot.jpeg",
      path: "public\\assets\\posts\\africanparrot.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Maple Avenue, Chicago",
      date: "05/04/2024",
      contact_info: "5554445555",
      pet_details: {
        species: "Parrot",
        breed: "African Grey",
        color: "Grey",
        other_details:
          "Found perched on a tree branch, eager to fly back home.",
      },
    },
  };

  const foundpost4 = {
    userID: insertedUsers.insertedIds[0].toString(),
    title: "Snowball Rescued!",
    content:
      "We found Snowball munching on some grass in the neighbor's garden. She seemed content and unharmed.",
    type: "found",
    image: {
      fieldname: "image",
      originalname: "dwarfrabbit.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "dwarfrabbit.jpeg",
      path: "public\\assets\\posts\\dwarfrabbit.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Willow Street, Seattle",
      date: "05/02/2024",
      contact_info: "5555556666",
      pet_details: {
        species: "Rabbit",
        breed: "Netherland Dwarf",
        color: "White",
        other_details: "Found munching on grass, unharmed.",
      },
    },
  };

  const foundpost5 = {
    userID: insertedUsers.insertedIds[3].toString(),
    title: "Gizmo Found Safe!",
    content:
      "We found Gizmo hiding behind the couch. He looked relieved to see us and immediately jumped into our arms.",
    type: "found",
    image: {
      fieldname: "image",
      originalname: "ferret.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "ferret.jpeg",
      path: "public\\assets\\posts\\ferret.jpeg",
      size: 771834,
    },
    lostfoundDetails: {
      location: "Pine Street, San Francisco",
      date: "05/04/2024",
      contact_info: "5556667777",
      pet_details: {
        species: "Ferret",
        breed: "Standard",
        color: "Brown",
        other_details: "Found hiding behind the couch, relieved to be found.",
      },
    },
  };

  // Create and log IDs for all found posts
  const foundpost1ID = await createPost(foundpost1);
  console.log(foundpost1ID);
  const foundpost2ID = await createPost(foundpost2);
  console.log(foundpost2ID);
  const foundpost3ID = await createPost(foundpost3);
  console.log(foundpost3ID);
  const foundpost4ID = await createPost(foundpost4);
  console.log(foundpost4ID);
  const foundpost5ID = await createPost(foundpost5);
  console.log(foundpost5ID);

  const generalpost1 = {
    userID: insertedUsers.insertedIds[0].toString(),
    title: "10 Surprising Facts About Dogs",
    content:
      "Did you know that dogs have an incredible sense of smell? They can detect some odors in parts per trillion! Learn more fascinating facts about our canine companions.",
    type: "general",
    image: null,
  };

  const generalpost2 = {
    userID: insertedUsers.insertedIds[1].toString(),
    title: "Keeping Your Cat Healthy: Tips for Cat Owners",
    content:
      "Cats are unique creatures with specific health needs. From diet to exercise, discover essential tips for keeping your feline friend healthy and happy.",
    type: "general",
    image: {
      fieldname: "image",
      originalname: "cattips.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "cattips.jpeg",
      path: "public\\assets\\posts\\cattips.jpeg",
      size: 771834,
    },
  };

  const generalpost3 = {
    userID: insertedUsers.insertedIds[2].toString(),
    title: "The Benefits of Having a Pet Rabbit",
    content:
      "Rabbits make wonderful pets for families and individuals alike. Learn about the benefits of having a pet rabbit and why they can be great companions.",
    type: "general",
    image: null,
  };

  const generalpost4 = {
    userID: insertedUsers.insertedIds[3].toString(),
    title: "Essential First Aid Tips for Pet Owners",
    content:
      "Accidents happen, but being prepared can make all the difference. Discover essential first aid tips every pet owner should know to keep their furry friends safe.",
    type: "general",
    image: {
      fieldname: "image",
      originalname: "petfirstaid.jpeg",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "./public/assets/posts",
      filename: "petfirstaid.jpeg",
      path: "public\\assets\\posts\\petfirstaid.jpeg",
      size: 771834,
    },
  };

  const generalpost5 = {
    userID: insertedUsers.insertedIds[4].toString(),
    title: "The Importance of Socialization for Dogs",
    content:
      "Socialization is crucial for dogs of all ages. Find out why socializing your dog is important and how it can contribute to their overall well-being and behavior.",
    type: "general",
    image: null,
  };

  // Create and log IDs for all general posts
  const generalpost1ID = await createPost(generalpost1);
  console.log(generalpost1ID);
  const generalpost2ID = await createPost(generalpost2);
  console.log(generalpost2ID);
  const generalpost3ID = await createPost(generalpost3);
  console.log(generalpost3ID);
  const generalpost4ID = await createPost(generalpost4);
  console.log(generalpost4ID);
  const generalpost5ID = await createPost(generalpost5);
  console.log(generalpost5ID);

  await closeConnection();
};

seedDatabase().catch(console.error);
