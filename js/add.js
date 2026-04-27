// js/add.js
requireAuth();
renderSidebar("Patients");

async function addPatient() {
  const errorMsg = document.getElementById("error-msg");
  const successMsg = document.getElementById("success-msg");
  const btn = document.getElementById("submit-btn");

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

  // Get values
  const name = document.getElementById("name").value.trim();
  const birthdate = document.getElementById("birthdate").value;
  const contact = document.getElementById("contact").value.trim();
  const address = document.getElementById("address").value.trim();
  const blood_type = document.getElementById("blood_type").value;
  const doctor = document.getElementById("doctor").value.trim();
  const allergies = document.getElementById("allergies").value.trim();
  const medicines = document.getElementById("medicines").value.trim();
  const medical_history = document
    .getElementById("medical_history")
    .value.trim();

  // Validate
  if (!name) {
    errorMsg.textContent = "Full name is required";
    errorMsg.classList.remove("hidden");
    return;
  }

  // Loading state
  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    // Step 1 - create person
    const person = await createPerson({ name, birthdate, contact, address });

    if (!person.id) {
      errorMsg.textContent = "Failed to create person record";
      errorMsg.classList.remove("hidden");
      btn.textContent = "Add Patient";
      btn.disabled = false;
      return;
    }

    // Step 2 - create patient record
    const patient = await createPatient({
      person_id: person.id,
      blood_type,
      doctor,
      allergies,
      medicines,
      medical_history,
    });

    if (!patient.id) {
      errorMsg.textContent = "Failed to create patient record";
      errorMsg.classList.remove("hidden");
      btn.textContent = "Add Patient";
      btn.disabled = false;
      return;
    }

    // Success
    successMsg.textContent = `${name} has been added successfully!`;
    successMsg.classList.remove("hidden");

    // Redirect to index after 1.5 seconds
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (err) {
    errorMsg.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsg.classList.remove("hidden");
    btn.textContent = "Add Patient";
    btn.disabled = false;
  }
}
