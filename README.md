# PawPal

PawPal is a web application developed as part of the CS546 course at Stevens Institute of Technology. It provides a platform for pet owners and pet institutions to interact, manage pet details, and facilitate pet adoption.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js: Our server is built on Node.js. You can download it [here](https://nodejs.org/en/download/).
- MongoDB: We use MongoDB as our database. You can download it [here](https://www.mongodb.com/try/download/community).

### Installation

1. Clone the repository: Use `git clone https://github.com/your-repo-url` to clone the repository to your local machine.
2. Install dependencies: Navigate to the project directory and use `npm install` to install the necessary packages for the project.
3. Start the server: Use `npm start` to start the server.

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
- Login Type Selection: Users can choose the type of login (user or institution) they want to proceed with.
- Session Management: The application maintains user sessions, ensuring a seamless user experience.
- Error Handling: The application handles errors effectively, ensuring that users are informed when an error occurs (e.g., error retrieving pets).

## Contributing

We welcome contributions from the community. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- This project was developed as part of Group 39 of CS546 at Stevens Institute of Technology.
- We would like to thank our professor and TAs for their continuous support and guidance.
