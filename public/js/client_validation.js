let user_form = document.getElementById("user_form");
let error_reg = document.getElementById("error_reg");

if (user_form) {
  user_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_reg.innerHTML = "";
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let gender = document.getElementById("gender").value.trim();
    let city = document.getElementById("city").value.trim();
    let state = document.getElementById("state").value.trim();
    let age = document.getElementById("age").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let profileImage = document.getElementById("profileImage");

    let isValidRegistration = true;

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      gender === "" ||
      city === "" ||
      state === "" ||
      age === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      city.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should contain only empty spaces";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (/\d/.test(firstName) || /\d/.test(lastName) || /\d/.test(city)) {
      let p = document.createElement("p");
      p.innerHTML = "First Name, Last Name, City should not contain a number";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (/[^a-zA-Z0-9\s]/.test(firstName)) {
      let p = document.createElement("p");
      p.innerHTML = "First Name should not contain special characters";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (/[^a-zA-Z0-9\s]/.test(lastName)) {
      let p = document.createElement("p");
      p.innerHTML = "Last Name should not contain special characters";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (
      firstName.length > 30 ||
      firstName.length < 2 ||
      lastName.length > 30 ||
      lastName.length < 2
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "First Name, Last Name should be between 2 to 30 characters";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      let p = document.createElement("p");
      p.innerHTML = "Invalid Email";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (parseInt(age) < 0 || parseInt(age) > 120) {
      let p = document.createElement("p");
      p.innerHTML = "Age should be positive and less than 120";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (parseInt(age) < 16) {
      let p = document.createElement("p");
      p.innerHTML = "Age should be less than 16";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (city.length > 40) {
      let p = document.createElement("p");
      p.innerHTML = "City exceeded character limit";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (/[^a-zA-Z0-9\s]/.test(city)) {
      let p = document.createElement("p");
      p.innerHTML = "City should not contain special characters";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (password.length < 8) {
      let p = document.createElement("p");
      p.innerHTML = "Password should be 8 characters long";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    for (let i = 0; i < password.length; i++) {
      if (password[i] == " ") {
        let p = document.createElement("p");
        p.innerHTML = "Password should not contain a space";
        error_reg.appendChild(p);
        isValidRegistration = false;
        event.preventDefault();
      }
    }

    if (!/[A-Z]/.test(password)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one uppercase character";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (!/\d/.test(password)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one numeric character";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (!/[^a-zA-Z0-9\s]/.test(password)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one special character";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (password !== confirmPassword) {
      let p = document.createElement("p");
      p.innerHTML = "Passwords should match";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (profileImage.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Profile Image should be uploaded";
      error_reg.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (isValidRegistration) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let user_form_update = document.getElementById("user_form_update");
let error_reg_update = document.getElementById("error_reg_update");

if (user_form_update) {
  user_form_update.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_reg_update.innerHTML = "";
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();

    let gender = document.getElementById("gender").value.trim();
    let city = document.getElementById("city").value.trim();
    let state = document.getElementById("state").value.trim();
    let age = document.getElementById("age").value;

    let isValidRegistration_update = true;

    if (
      firstName === "" ||
      lastName === "" ||
      gender === "" ||
      city === "" ||
      state === "" ||
      age === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      city.trim() === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should contain only empty spaces";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }

    if (/\d/.test(firstName) || /\d/.test(lastName) || /\d/.test(city)) {
      let p = document.createElement("p");
      p.innerHTML = "First Name, Last Name, City should not contain a number";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }
    if (/[^a-zA-Z0-9\s]/.test(firstName)) {
      let p = document.createElement("p");
      p.innerHTML = "First Name should not contain special characters";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }

    if (/[^a-zA-Z0-9\s]/.test(lastName)) {
      let p = document.createElement("p");
      p.innerHTML = "Last Name should not contain special characters";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }

    if (
      firstName.length > 30 ||
      firstName.length < 2 ||
      lastName.length > 30 ||
      lastName.length < 2
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "First Name, Last Name should be between 2 to 30 characters";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }

    if (parseInt(age) < 0 || parseInt(age) > 120) {
      let p = document.createElement("p");
      p.innerHTML = "Age should be positive and less than 120";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }
    if (parseInt(age) < 16) {
      let p = document.createElement("p");
      p.innerHTML = "Age should be less than 16";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }
    if (city.length > 40) {
      let p = document.createElement("p");
      p.innerHTML = "City exceeded character limit";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }
    if (/[^a-zA-Z0-9\s]/.test(city)) {
      let p = document.createElement("p");
      p.innerHTML = "City should not contain special characters";
      error_reg_update.appendChild(p);
      isValidRegistration_update = false;
      event.preventDefault();
    }

    if (isValidRegistration_update) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let pet_form = document.getElementById("pet_form");
let error_pet = document.getElementById("error_pet");

if (pet_form) {
  pet_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_pet.innerHTML = "";
    let name = document.getElementById("name").value.trim();
    let species = document.getElementById("species").value.trim();
    let breed = document.getElementById("breed").value.trim();
    let description = document.getElementById("description").value.trim();
    let petImage = document.getElementById("petImage");

    let isValidPet = true;

    if (name === "" || species === "" || breed === "" || description === "") {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }

    if (name.length > 30 || name.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Name should be between 2 and 30 characters";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }

    if (/\d/.test(name)) {
      let p = document.createElement("p");
      p.innerHTML = "Name should not contain a number";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }

    if (/[^a-zA-Z0-9\s]/.test(name)) {
      let p = document.createElement("p");
      p.innerHTML = "Name should not contain special characters";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }

    if (species.length > 30 || species.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Species should be between 2 and 30 characters";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }
    if (breed.length > 30 || breed.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Breed should be between 2 and 30 characters";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }
    if (description.length > 150 || description.length < 5) {
      let p = document.createElement("p");
      p.innerHTML = "Description should be between 5 and 150 characters";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }
    if (petImage.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Profile Image should be uploaded";
      error_pet.appendChild(p);
      isValidPet = false;
      event.preventDefault();
    }

    if (isValidPet) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let pet_form_update = document.getElementById("pet_form_update");
let error_pet_update = document.getElementById("error_pet_update");

if (pet_form_update) {
  pet_form_update.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_pet_update.innerHTML = "";
    let name = document.getElementById("name").value.trim();
    let species = document.getElementById("species").value.trim();
    let breed = document.getElementById("breed").value.trim();
    let description = document.getElementById("description").value.trim();

    let isValidPetupdate = true;

    if (name === "" || species === "" || breed === "" || description === "") {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }
    if (name.length > 30 || name.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Name should be between 2 and 30 characters";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }
    if (/\d/.test(name)) {
      let p = document.createElement("p");
      p.innerHTML = "Name should not contain a number";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }
    if (/[^a-zA-Z0-9\s]/.test(name)) {
      let p = document.createElement("p");
      p.innerHTML = "Name should not contain special characters";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }

    if (species.length > 30 || species.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Species should be between 2 and 30 characters";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }
    if (breed.length > 30 || breed.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Breed should be between 2 and 30 characters";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }
    if (description.length > 150 || description.length < 5) {
      let p = document.createElement("p");
      p.innerHTML = "Description should be between 5 and 150 characters";
      error_pet_update.appendChild(p);
      isValidPetupdate = false;
      event.preventDefault();
    }

    if (isValidPetupdate) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let institute_form = document.getElementById("institute_form");
let error_institute = document.getElementById("error_institute");

if (institute_form) {
  institute_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_institute.innerHTML = "";
    let institute_name = document.getElementById("institute_name").value.trim();
    let institute_email = document
      .getElementById("institute_email")
      .value.trim();
    let services = document.getElementById("services").value.trim();
    let address = document.getElementById("address").value.trim();
    let institute_city = document.getElementById("institute_city").value.trim();
    let institute_state = document
      .getElementById("institute_state")
      .value.trim();
    let hashedPassword = document.getElementById("hashedPassword").value.trim();
    let confirmhashedPassword = document
      .getElementById("confirmhashedPassword")
      .value.trim();
    let instituteImage = document.getElementById("instituteImage");

    let isValidInstitute = true;

    if (
      institute_name === "" ||
      institute_email === "" ||
      services === "" ||
      address === "" ||
      institute_city === "" ||
      institute_state === "" ||
      hashedPassword === "" ||
      confirmhashedPassword === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      institute_name.trim() === "" ||
      institute_email.trim() === "" ||
      address.trim() === "" ||
      institute_city.trim() === "" ||
      hashedPassword.trim() === "" ||
      confirmhashedPassword.trim() === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be only spaces";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      /[^a-zA-Z0-9\s]/.test(institute_name) ||
      /[^a-zA-Z0-9\s]/.test(institute_city) ||
      /[^a-zA-Z0-9\s]/.test(address)
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "Institute Name and City should not contain special characters";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }

    if (/\d/.test(institute_name) || /\d/.test(institute_city)) {
      let p = document.createElement("p");
      p.innerHTML = "Institute name and City cannot contain a number";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      institute_city.length > 30 ||
      institute_city.length < 2 ||
      institute_name < 2 ||
      institute_name > 30
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "Institute name and City should be between 2 and 30 characters";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (address > 50 || address.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Address should be between 2 and 30 characters";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(institute_email)
    ) {
      let p = document.createElement("p");
      p.innerHTML = "Invalid Email";
      error_institute.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }
    if (hashedPassword.length < 8) {
      let p = document.createElement("p");
      p.innerHTML = "Password should be 8 characters long";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    for (let i = 0; i < hashedPassword.length; i++) {
      if (hashedPassword[i] == " ") {
        let p = document.createElement("p");
        p.innerHTML = "Password should not contain a space";
        error_institute.appendChild(p);
        isValidInstitute = false;
        event.preventDefault();
      }
    }

    if (!/[A-Z]/.test(hashedPassword)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one uppercase character";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (!/\d/.test(hashedPassword)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one numeric character";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (!/[^a-zA-Z0-9\s]/.test(hashedPassword)) {
      let p = document.createElement("p");
      p.innerHTML = "Password should contain atleast one special character";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (hashedPassword !== confirmhashedPassword) {
      let p = document.createElement("p");
      p.innerHTML = "Passwords should match";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (instituteImage.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Profile Image for Institution should be uploaded";
      error_institute.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }

    if (isValidInstitute) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let institute_form_update = document.getElementById("institute_form_update");
let error_institute_update = document.getElementById("error_institute_update");

if (institute_form_update) {
  institute_form_update.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_institute_update.innerHTML = "";
    let institute_name = document.getElementById("institute_name").value.trim();
    let institute_email = document
      .getElementById("institute_email")
      .value.trim();
    let services = document.getElementById("services").value.trim();
    let address = document.getElementById("address").value.trim();
    let institute_city = document.getElementById("institute_city").value.trim();
    let institute_state = document
      .getElementById("institute_state")
      .value.trim();

    let isValidInstitute = true;

    if (
      institute_name === "" ||
      institute_email === "" ||
      services === "" ||
      address === "" ||
      institute_city === "" ||
      institute_state === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be empty";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      institute_name.trim() === "" ||
      institute_email.trim() === "" ||
      address.trim() === "" ||
      institute_city.trim() === ""
    ) {
      let p = document.createElement("p");
      p.innerHTML = "No field should be only spaces";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      /[^a-zA-Z0-9\s]/.test(institute_name) ||
      /[^a-zA-Z0-9\s]/.test(institute_city)
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "Institute Name and City should not contain special characters";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }

    if (/\d/.test(institute_name) || /\d/.test(institute_city)) {
      let p = document.createElement("p");
      p.innerHTML = "Institute name and City cannot contain a number";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      institute_city.length > 30 ||
      institute_city.length < 2 ||
      institute_name < 2 ||
      institute_name > 30
    ) {
      let p = document.createElement("p");
      p.innerHTML =
        "Institute name and City should be between 2 and 30 characters";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (address > 50 || address.length < 2) {
      let p = document.createElement("p");
      p.innerHTML = "Address should be between 2 and 30 characters";
      error_institute_update.appendChild(p);
      isValidInstitute = false;
      event.preventDefault();
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(institute_email)
    ) {
      let p = document.createElement("p");
      p.innerHTML = "Invalid Email";
      error_institute_update.appendChild(p);
      isValidRegistration = false;
      event.preventDefault();
    }

    if (isValidInstitute) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let user_login = document.getElementById("user_login");
let error_userlogin = document.getElementById("error_userlogin");
if (user_login) {
  user_login.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_userlogin.innerHTML = "";
    let login_email = document.getElementById("email").value;
    let login_password = document.getElementById("password").value;
    let isValidUserLogin = true;

    if (login_email === "" || login_password === "") {
      let p = document.createElement("p");
      p.innerHTML = "Email or Password is empty";
      error_userlogin.appendChild(p);
      isValidUserLogin = false;
      event.preventDefault();
    }

    if (isValidUserLogin) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let institution_login = document.getElementById("institute_login");
let error_institution = document.getElementById("error_institution");
if (institution_login) {
  institution_login.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    error_institution.innerHTML = "";
    let institution_email = document.getElementById("email").value;
    let institution_password = document.getElementById("password").value;
    let isValidUserInstitution = true;

    if (institution_email === "" || institution_password === "") {
      let p = document.createElement("p");
      p.innerHTML = "Email or Password is empty";
      error_institution.appendChild(p);
      isValidUserInstitution = false;
      event.preventDefault();
    }

    if (isValidUserInstitution) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let forgotPasswordForm = document.getElementById("forgot-password-form");
let errorForgotPassword = document.getElementById("error-forgot-password");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    errorForgotPassword.innerHTML = "";
    let email = document.getElementById("email").value.trim();
    let isValidForgotPassword = true;

    if (email === "") {
      let p = document.createElement("p");
      p.innerHTML = "Email field should not be empty";
      errorForgotPassword.appendChild(p);
      isValidForgotPassword = false;
      event.preventDefault();
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      let p = document.createElement("p");
      p.innerHTML = "Invalid Email";
      errorForgotPassword.appendChild(p);
      isValidForgotPassword = false;
      event.preventDefault();
    }

    if (isValidForgotPassword) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let otpForm = document.getElementById("otp-form");
let errorOtp = document.querySelector(".otp-error");

if (otpForm) {
  otpForm.addEventListener("submit", function (event) {
    let otpInput = document.getElementById("otp");
    let otp = otpInput.value.trim();

    // Clear previous error message
    errorOtp.innerHTML = "";

    // Check if OTP field is empty
    if (otp === "") {
      event.preventDefault(); // Prevent form submission
      errorOtp.textContent = "OTP field cannot be empty.";
      return;
    }

    // Check if OTP is exactly 6 digits
    if (!/^[a-zA-Z0-9]{6}$/.test(otp)) {
      event.preventDefault(); // Prevent form submission
      errorOtp.textContent = "OTP should be exactly 6 digits.";
      return;
    }
  });
}

let resetPasswordForm = document.getElementById("reset-password-form");
let errorResetPassword = document.getElementById("error-reset-password");

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (event) {
    let newPasswordInput = document.getElementById("new-password");
    let confirmPasswordInput = document.getElementById("confirm-password");
    let newPassword = newPasswordInput.value.trim();
    let confirmPassword = confirmPasswordInput.value.trim();

    // Clear previous error message
    errorResetPassword.innerHTML = "";

    // Check if newPassword and confirmPassword fields are not empty
    if (newPassword === "" || confirmPassword === "") {
      event.preventDefault(); // Prevent form submission
      errorResetPassword.textContent = "Both fields are required.";
      return;
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      event.preventDefault(); // Prevent form submission
      errorResetPassword.textContent = "Passwords do not match.";
      return;
    }
  });
}

let user_image_update_form = document.getElementById("user_image_update_form");
let not_uploaded = document.getElementById("not_uploaded");
if (user_image_update_form) {
  user_image_update_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();
    let user_image_update = document.getElementById("updated_profile_pic");
    console.log(user_image_update);
    let isValidUserImageUpdate = true;

    if (user_image_update.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Upload an Image before Submitting";
      not_uploaded.appendChild(p);
      isValidUserImageUpdate = false;
      event.preventDefault();
    }

    if (isValidUserImageUpdate) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let pet_image_update_form = document.getElementById("pet_image_update_form");
let pet_image_not_uploaded = document.getElementById("pet_image_not_uploaded");
if (pet_image_update_form) {
  pet_image_update_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    let pet_image_update = document.getElementById("updated_pet_pic");
    let isValidPetImageUpdate = true;

    if (pet_image_update.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Upload an Image before Submitting";
      pet_image_not_uploaded.appendChild(p);
      isValidPetImageUpdate = false;
      event.preventDefault();
    }

    if (isValidPetImageUpdate) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}

let inst_image_update_form = document.getElementById("inst_image_update_form");
let inst_image_not_uploaded = document.getElementById(
  "inst_image_not_uploaded"
);
if (inst_image_update_form) {
  inst_image_update_form.addEventListener("submit", (event) => {
    console.log("Form submission fired");
    event.preventDefault();

    let inst_image_update = document.getElementById("updated_profile_pic");
    let isValidInstImageUpdate = true;

    if (inst_image_update.files.length === 0) {
      let p = document.createElement("p");
      p.innerHTML = "Upload an Image before Submitting";
      inst_image_not_uploaded.appendChild(p);
      isValidInstImageUpdate = false;
      event.preventDefault();
    }

    if (isValidInstImageUpdate) {
      event.target.submit();
    } else {
      event.preventDefault();
    }
  });
}
