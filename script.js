document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  const rangeInput = document.getElementById("satisfaction");
  const rangeValueDisplay = document.getElementById("rangeValue");

  // New Modal Elements
  const modal = document.getElementById("confirmationModal");
  const modalDataOutput = document.getElementById("modalDataOutput");
  const closeModalButton = document.getElementById("closeModalButton");
  const okButton = document.getElementById("okButton");

  // Function to close the modal
  const closeModal = () => {
    modal.style.display = "none";
    // Optional: Reset the form after successful submission and closure
    form.reset();
    rangeValueDisplay.textContent = rangeInput.value; // Reset range display
  };

  // Attach close handlers
  closeModalButton.addEventListener("click", closeModal);
  okButton.addEventListener("click", closeModal);

  // Close the modal if the user clicks anywhere outside of it
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });

  // Update range value display for Energy Level
  rangeInput.addEventListener("input", () => {
    rangeValueDisplay.textContent = rangeInput.value;
  });

  // Main validation function
  const validateForm = (event) => {
    let isValid = true;
    let firstInvalidField = null;

    // Clear previous error messages and styling
    document
      .querySelectorAll(".error-message")
      .forEach((span) => (span.textContent = ""));
    document
      .querySelectorAll("input, select, textarea")
      .forEach((input) => input.classList.remove("invalid"));

    // Clear custom age error styling
    document.getElementById("ageYears").classList.remove("invalid");
    document.getElementById("ageMonths").classList.remove("invalid");

    // Helper function to mark invalid and capture the first error
    const markInvalid = (element, message, capture = true) => {
      element.classList.add("invalid");
      const errorSpan = document.getElementById(element.id + "Error");
      if (errorSpan) {
        errorSpan.textContent = message;
      }
      if (capture && !firstInvalidField) {
        firstInvalidField = element;
      }
      isValid = false;
    };

    // --- Custom Validation Logic ---

    // 1. Pet Name (Text) Validation
    const petName = document.getElementById("fullName");
    if (petName.value.trim().length < 2) {
      markInvalid(petName, "Pet name must be at least 2 characters.");
    }

    // 2. Owner's Email Validation
    const email = document.getElementById("email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      markInvalid(
        email,
        "Please enter a valid email address for the owner's contact."
      );
    }

    // 3. Password Validation (Check for length and at least one digit)
    const password = document.getElementById("password");
    const digitPattern = /\d/;
    if (password.value.length < 8) {
      markInvalid(password, "Password must be at least 8 characters long.");
    } else if (!digitPattern.test(password.value)) {
      markInvalid(password, "Password should contain at least one number.");
    }

    // 4. Pet Age (Years and Months) Validation
    const ageYearsInput = document.getElementById("ageYears");
    const ageMonthsInput = document.getElementById("ageMonths");
    const ageYears = parseInt(ageYearsInput.value) || 0; // Use 0 if NaN
    const ageMonths = parseInt(ageMonthsInput.value) || 0; // Use 0 if NaN

    const totalMonths = ageYears * 12 + ageMonths;

    if (
      ageYears < 0 ||
      ageMonths < 0 ||
      totalMonths === 0 ||
      isNaN(ageYears) ||
      isNaN(ageMonths)
    ) {
      // Mark both fields invalid if the total age is 0 or inputs are invalid
      ageYearsInput.classList.add("invalid");
      ageMonthsInput.classList.add("invalid");
      document.getElementById("ageError").textContent =
        "Please enter a valid age (at least 1 month).";
      isValid = false;
      if (!firstInvalidField) {
        firstInvalidField = ageYearsInput;
      }
    } else if (ageYears > 30) {
      markInvalid(ageYearsInput, "Pet's age cannot exceed 30 years.");
    }

    // 5. Adoption Date (Date) Validation
    const adoptionDate = document.getElementById("dob");
    if (!adoptionDate.value) {
      markInvalid(adoptionDate, "The adoption date is required.");
    }

    // 6. Radio Button (Species) Validation
    const speciesRadios = document.getElementsByName("species");
    let speciesSelected = false;
    speciesRadios.forEach((radio) => {
      if (radio.checked) {
        speciesSelected = true;
      }
    });
    if (!speciesSelected) {
      document.getElementById("genderError").textContent =
        "Please select the pet species.";
      isValid = false;
      if (!firstInvalidField) {
        firstInvalidField = speciesRadios[0];
      }
    }

    // 7. Select (Diet Type) Validation
    const dietType = document.getElementById("country");
    if (dietType.value === "") {
      markInvalid(dietType, "Please select the pet's diet type.");
    }

    // 8. File Input Validation (Pet Photo)
    const petPhoto = document.getElementById("profilePic");
    if (petPhoto.files.length === 0) {
      // Mark invalid, but often better not to scroll to the file input
      markInvalid(petPhoto, "A pet photo is required.", false);
    }

    // Final check using native HTML5 validation constraints
    if (!form.checkValidity()) {
      isValid = false;
      form.querySelectorAll(":invalid").forEach((input) => {
        input.classList.add("invalid");
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      });
    }

    // --- Submission Logic ---
    if (!isValid) {
      // Prevent default form submission if validation fails
      event.preventDefault();
      // Scroll to the first invalid field for better UX
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      // If valid, prevent default submission
      event.preventDefault();

      const formData = new FormData(form);
      const submittedData = {};
      let htmlOutput = "";

      const petAgeString = `${ageYears} Years, ${ageMonths} Months`;

      // Define a list of fields to display and their friendly names
      const fieldsToDisplay = {
        petName: "Pet's Name",
        ownerEmail: "Owner's Email",
        petAge: "Pet's Age", // Custom field for age string
        adoptionDate: "Adoption Date",
        energyLevel: "Energy Level (1-10)",
        petPhoto: "Pet Photo File",
        vetChecked: "Vet Records Up-to-Date",
        species: "Species",
        dietType: "Diet Type",
        // *** CHANGED THIS LABEL ***
        notes: "Quirks & Habits",
        // ***************************
      };

      // Manually add the combined age string to the display/log data
      submittedData["petAge"] = petAgeString;
      htmlOutput += `<p><strong>${fieldsToDisplay.petAge}:</strong> ${petAgeString}</p>`;

      // 1. Log and populate the modal content
      formData.forEach((value, key) => {
        let displayValue = value;

        // Handle specific values for logging/display
        if (key === "petPhoto" && value instanceof File) {
          submittedData[key] = `File: ${value.name} (${value.size} bytes)`;
          displayValue = value.name;
        } else {
          submittedData[key] = value;
        }

        // Build HTML for the modal, skipping individual age fields, password, and hidden fields
        if (
          fieldsToDisplay[key] &&
          key !== "petAgeYears" &&
          key !== "petAgeMonths" &&
          key !== "petAge"
        ) {
          let label = fieldsToDisplay[key];

          if (key === "vetChecked" && value === "yes") {
            htmlOutput += `<p><strong>${label}:</strong> Yes</p>`;
          } else if (key === "notes" && !value) {
            htmlOutput += `<p><strong>${label}:</strong> None provided</p>`; // Show 'None provided' if left blank
          } else if (
            key !== "vetChecked" &&
            key !== "password" &&
            key !== "formType"
          ) {
            htmlOutput += `<p><strong>${label}:</strong> ${displayValue}</p>`;
          }
        }
        // Ensure all submitted form fields (except individual age parts) are logged
        if (key !== "petAgeYears" && key !== "petAgeMonths") {
          submittedData[key] = value;
        }
      });

      // Add 'vetChecked' explicitly if it wasn't present (meaning unchecked)
      if (!formData.has("vetChecked")) {
        htmlOutput += `<p><strong>Vet Records Up-to-Date:</strong> No</p>`;
        submittedData["vetChecked"] = "No"; // Add to log as 'No'
      }

      // 2. Display Log in Console
      // Note: The submittedData object now includes the combined 'petAge' string
      console.log("--- Form Submission Data ---");
      console.log(submittedData);
      console.log("--------------------------");

      // 3. Display Data in Modal and Show Modal
      modalDataOutput.innerHTML = htmlOutput;
      modal.style.display = "block";
    }
  };

  // Attach the validation function to the form's submit event
  form.addEventListener("submit", validateForm);
});
