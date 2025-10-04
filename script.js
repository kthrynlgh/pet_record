document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  const rangeInput = document.getElementById("satisfaction");
  const rangeValueDisplay = document.getElementById("rangeValue");

  // Update range value display
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

    // --- Custom Validation Logic (Adapted for Pet Context) ---

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

    // 4. Pet Age (Number) Validation
    const petAge = document.getElementById("age");
    const ageVal = parseInt(petAge.value);
    if (isNaN(ageVal) || ageVal < 1 || ageVal > 30) {
      markInvalid(petAge, "Pet's age must be between 1 and 30 years.");
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
      markInvalid(petPhoto, "A pet photo is required.", false); // Don't scroll to file input, often bad UX
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
      // If valid, prevent default submission to handle redirection manually
      event.preventDefault();

      console.log("Pet profile valid. Redirecting to confirmation...");

      // REDIRECT to the confirmation page
      window.location.href = form.action;
    }
  };

  // Attach the validation function to the form's submit event
  form.addEventListener("submit", validateForm);
});
