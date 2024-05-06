# PawPal

Web Dev Project

demo link: http://172.203.162.111:9123/

PawPal is a web application developed as part of the CS546 course at Stevens Institute of Technology. It provides a platform for pet owners and pet institutions to interact, manage pet details, and facilitate pet adoption.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To set up and run PawPal, ensure you have the following dependencies installed:

- [Node.js](https://nodejs.org/): Required for running the server-side JavaScript environment.
- [MongoDB](https://www.mongodb.com/): Used as the database for storing application data.

Additionally, the following Node.js packages are required for the project:

- **bcrypt**: Used for hashing and securing passwords.
- **bcryptjs**: An alternative library for password hashing; used in case of compatibility issues with `bcrypt`.
- **express**: The primary framework for building web applications in Node.js.
- **express-handlebars**: A templating engine used to render views in Express.
- **express-session**: Enables session management, allowing you to maintain user sessions between HTTP requests.
- **mongodb**: Provides the MongoDB client for interacting with the MongoDB database.

Make sure these packages are installed as part of your setup process. You can use `npm install` to install all the required dependencies as defined in the project's `package.json`.

### Installation

1. Clone the repository: Use `git clone https://github.com/Akshat2634/PawPal.git` to clone the repository to your local machine.
2. Install dependencies: Navigate to the project directory and use `npm install` to install the necessary packages for the project.
3. Seed the database: Use `npm run seed` to seed.
4. Start the server: Use `npm start` to start the server.

## Usage

Once the server is running, navigate to `http://localhost:3000` in your web browser. You can login as a user or an institution, manage pets, and interact with other users or institutions.

## Features

- User Authentication: Users can securely register and login to their accounts using the login route.
- Institution Authentication: Institutions can securely register and login to their accounts.
- User Dashboard: Once logged in, users are redirected to their dashboard where they can view their pets and manage them.
- Institution Dashboard: Institutions have their own dashboard to manage their details.
- Pet Management: Users can add, update, and delete their pets' details.
- Institution Interaction: Users can interact with institutions for pet adoption.
- Appointment Scheduling: Users can schedule appointments with institutions.
- Post Creation: Users and institutions can create posts.
- Commenting: Users and institutions can comment on posts.
- Reviews: Users can leave reviews for institutions.
- Journal: Users can create a daily tracker for their pets and record the activities they do.
- Login Type Selection: Users can choose the type of login (user or institution) they want to proceed with.
- Session Management: The application maintains user sessions, ensuring a seamless user experience.
- Error Handling: The application handles errors effectively, ensuring that users are informed when an error occurs (e.g., error retrieving pets).

## Acknowledgments

- This project was developed as part of Group 39 of CS546 at Stevens Institute of Technology.
- We would like to thank our professor and TAs for their continuous support and guidance.

