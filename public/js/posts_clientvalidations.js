var addpostForm = $("#add-post");
$("#add-post").submit((event) => {
  event.preventDefault();
  console.log("getting here");
  $("#error-list-client").hide();
  $("#error-list-client").empty();
  var errors = [];
  var postFields = {
    title: $("#title").val(),
    content: $("#content").val(),
    type: $("#type").val(),
    image: $("#image").val() ? "got" : "",
    lostfoundDetails:
      $("#type").val() === "general"
        ? null
        : {
            location: $("#details_location").val(),
            date: $("#details_date").val()
              ? formatHTMLDate($("#details_date").val())
              : null,
            contact_info: $("#details_contact").val(),
            pet_details: {
              species: $("#petdetails_species").val(),
              breed: $("#petdetails_breed").val(),
              color: $("#petdetails_color").val(),
              other_details: $("#petdetails_other").val(),
            },
          },
  };
  try {
    if (postFields?.title === undefined) throw `Title needs to be Provided.`;
    postFields.title = postHelpers.istitleValid(postFields.title);
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields?.content === undefined)
      throw `Content needs to be Provided.`;
    postFields.content = postHelpers.iscontentValid(postFields.content);
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields?.type === undefined) throw `Type needs to be Provided.`;
    postFields.type = postHelpers.istypeValid(postFields.type);
    if (
      !(
        postFields.type === "general" ||
        postFields.type === "lost" ||
        postFields.type === "found"
      )
    )
      throw `Type needs to be GENERAL or LOST or FOUND`;
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields.type === "lost" || postFields.type === "found") {
      if (!postFields.lostfoundDetails) throw `Must have Lost-Found Details.`;
      if (postFields.lostfoundDetails.location === "")
        errors.push(`Must Provide Location`);
      if (postFields.lostfoundDetails.date === null)
        errors.push(`Must Provide Date`);
      if (postFields.lostfoundDetails.contact_info === "")
        errors.push(`Must Provide Contact Info`);
      if (postFields.lostfoundDetails.pet_details === "")
        errors.push(`Must Provide Pet Details`);
      if (postFields.lostfoundDetails.pet_details.species === "")
        errors.push(`Must Provide Pet Species`);
      if (postFields.lostfoundDetails.pet_details.breed === "")
        errors.push(`Must Provide Pet Breed`);
      if (postFields.lostfoundDetails.pet_details.color === "")
        errors.push(`Must Provide Pet Color`);
      if (postFields.lostfoundDetails.pet_details.other_details === "")
        errors.push(`Must Provide Pet Details`);
      postFields.lostfoundDetails = postHelpers.islfdetailsValid(
        postFields.lostfoundDetails
      );
      if (postFields.image === "") throw `Need Image.`;
    } else {
      if (postFields.lostfoundDetails)
        throw `General Post cannot have Lost-Found Details.`;
    }
  } catch (e) {
    errors.push(e);
  }
  //   // Display errors if any
  if (errors.length > 0) {
    $("#error-list-client").show();
    var errorList = $("#error-list-client");
    errors.forEach((error) => {
      errorList.append("<li>" + error + "</li>");
    });
  } else {
    addpostForm.get(0).submit();
  }
});

var editpostForm = $("#edit-post");
$("#edit-post").submit((event) => {
  event.preventDefault();
  console.log("getting here");
  $("#error-list-client").hide();
  $("#error-list-client").empty();
  var errors = [];
  var postFields = {
    title: $("#title").val(),
    content: $("#content").val(),
    type: $("#type").val(),
    lostfoundDetails:
      $("#type").val() === "general"
        ? null
        : {
            location: $("#details_location").val(),
            date: $("#details_date").val()
              ? formatHTMLDate($("#details_date").val())
              : null,
            contact_info: $("#details_contact").val(),
            pet_details: {
              species: $("#petdetails_species").val(),
              breed: $("#petdetails_breed").val(),
              color: $("#petdetails_color").val(),
              other_details: $("#petdetails_other").val(),
            },
          },
  };
  try {
    if (postFields?.title === undefined) throw `Title needs to be Provided.`;
    postFields.title = postHelpers.istitleValid(postFields.title);
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields?.content === undefined)
      throw `Content needs to be Provided.`;
    postFields.content = postHelpers.iscontentValid(postFields.content);
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields?.type === undefined) throw `Type needs to be Provided.`;
    postFields.type = postHelpers.istypeValid(postFields.type);
    if (
      !(
        postFields.type === "general" ||
        postFields.type === "lost" ||
        postFields.type === "found"
      )
    )
      throw `Type needs to be GENERAL or LOST or FOUND`;
  } catch (e) {
    errors.push(e);
  }
  try {
    if (postFields.type === "lost" || postFields.type === "found") {
      if (!postFields.lostfoundDetails) throw `Must have Lost-Found Details.`;
      if (postFields.lostfoundDetails.location === "")
        errors.push(`Must Provide Location`);
      if (postFields.lostfoundDetails.date === null)
        errors.push(`Must Provide Date`);
      if (postFields.lostfoundDetails.contact_info === "")
        errors.push(`Must Provide Contact Info`);
      if (postFields.lostfoundDetails.pet_details === "")
        errors.push(`Must Provide Pet Details`);
      if (postFields.lostfoundDetails.pet_details.species === "")
        errors.push(`Must Provide Pet Species`);
      if (postFields.lostfoundDetails.pet_details.breed === "")
        errors.push(`Must Provide Pet Breed`);
      if (postFields.lostfoundDetails.pet_details.color === "")
        errors.push(`Must Provide Pet Color`);
      if (postFields.lostfoundDetails.pet_details.other_details === "")
        errors.push(`Must Provide Pet Details`);
      postFields.lostfoundDetails = postHelpers.islfdetailsValid(
        postFields.lostfoundDetails
      );
    } else {
      if (postFields.lostfoundDetails)
        throw `General Post cannot have Lost-Found Details.`;
    }
  } catch (e) {
    errors.push(e);
  }
  //   // Display errors if any
  if (errors.length > 0) {
    $("#error-list-client").show();
    var errorList = $("#error-list-client");
    errors.forEach((error) => {
      errorList.append("<li>" + error + "</li>");
    });
  } else {
    editpostForm.get(0).submit();
  }
});

const validators = {
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

const postHelpers = {
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

const getCurrentDateTime = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year}@${hours}:${minutes}:${seconds}`;
};

function formatHTMLDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

$(document).ready(function () {
  $("#searchInput").on("input", function () {
    var searchTerm = $(this).val().trim();

    if (searchTerm.length > 0) {
      $.ajax({
        url: "/posts/search",
        method: "POST",
        data: { q: searchTerm },
        success: function (data) {
          displayResults(data);
        },
        error: function (xhr, status, error) {
          console.error("Error fetching search results:", error);
        },
      });
    } else {
      $("#searchResults").empty(); // Clear results if search input is empty
    }
  });

  function displayResults(results) {
    var $searchResults = $("#searchResults");
    $searchResults.empty(); // Clear previous results

    if (results.length > 0) {
      results.forEach((item) => {
        $searchResults.append("<p>" + item.title + "</p>");
      });
    } else {
      $searchResults.append("<p>No results found.</p>");
    }
  }
});
