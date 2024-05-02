// const signinForm = document.getElementById("signin-form");

// if (signinForm) {
//   signinForm.addEventListener("submit", async (e) => {
//     const oldErrors = document.querySelectorAll(".error");
//     oldErrors.forEach((error) => error.remove());
//     e.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     if (!email || !password) {
//       const error = document.createElement("p");
//       error.innerText = "Both fields are required";
//       error.id = "error";
//       error.className = "error";
//       document.querySelector("#signin-form").appendChild(error);
//       return;
//     }

//     if (!email.includes("@")) {
//       const error = document.createElement("p");
//       error.innerText = "Please enter a valid email address";
//       error.id = "error";
//       error.className = "error";
//       document.querySelector("#signin-form").appendChild(error);
//       return;
//     }

//     if (
//       password.length < 8 ||
//       !/[A-Z]/.test(password) ||
//       !/[0-9]/.test(password) ||
//       !/[!@#$%^&*]/.test(password)
//     ) {
//       const error = document.createElement("p");
//       error.innerText =
//         "Password should be at least 8 characters long, contain at least one uppercase letter, one number, and one special character";
//       error.id = "error";
//       error.className = "error";
//       document.querySelector("#signin-form").appendChild(error);
//       return;
//     }
//     this.submit();
//   });
// }
