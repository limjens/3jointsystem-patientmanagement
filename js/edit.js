// js/edit.js
requireAuth();
renderSidebar("Patients");

// Get person_id from URL
const params = new URLSearchParams(window.location.search);
const personId = params.get("id");

// If no id go back to index
if (!personId) window.location.href = "index.html";

// Load existing data into form
async function loadPatient() {
  try {
    const [person, patient] = await Promise.all([
      getPerson(personId),
      getPatient(personId),
    ]);

    // Fill personal info
    document.getElementById("name").value = person.name || "";
    document.getElementById("birthdate").value = person.birthdate || "";
    document.getElementById("contact").value = person.contact || "";
    document.getElementById("address").value = person.address || "";

    // Fill medical info
    document.getElementById("blood_type").value = patient.blood_type || "";
    document.getElementById("doctor").value = patient.doctor || "";
    document.getElementById("allergies").value = patient.allergies || "";
    document.getElementById("medicines").value = patient.medicines || "";
    document.getElementById("medical_history").value =
      patient.medical_history || "";
  } catch (err) {
    document.getElementById("error-msg").textContent =
      "Failed to load patient data";
    document.getElementById("error-msg").classList.remove("hidden");
  }
}

async function savePatient() {
  const errorMsg = document.getElementById("error-msg");
  const successMsg = document.getElementById("success-msg");
  const btn = document.getElementById("submit-btn");

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

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

  if (!name) {
    errorMsg.textContent = "Full name is required";
    errorMsg.classList.remove("hidden");
    return;
  }

  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    // Update person and patient at the same time
    await Promise.all([
      updatePerson(personId, { name, birthdate, contact, address }),
      updatePatient(personId, {
        blood_type,
        doctor,
        allergies,
        medicines,
        medical_history,
      }),
    ]);

    successMsg.textContent = "Patient updated successfully!";
    successMsg.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = `view.html?id=${personId}`;
    }, 1500);
  } catch (err) {
    errorMsg.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsg.classList.remove("hidden");
    btn.textContent = "Save Changes";
    btn.disabled = false;
  }
}

loadPatient();
