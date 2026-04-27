// js/view.js
requireAuth();
renderSidebar("Patients");

// Get person_id from URL
const params = new URLSearchParams(window.location.search);
const personId = params.get("id");

// If no id in URL go back to index
if (!personId) window.location.href = "index.html";

async function loadPatient() {
  try {
    // Fetch both person and patient at the same time
    const [person, patient] = await Promise.all([
      getPerson(personId),
      getPatient(personId),
    ]);

    // Fill in personal info
    document.getElementById("name").textContent = person.name || "N/A";
    document.getElementById("birthdate").textContent =
      person.birthdate || "N/A";
    document.getElementById("contact").textContent = person.contact || "N/A";
    document.getElementById("address").textContent = person.address || "N/A";

    // Fill in medical info
    document.getElementById("blood_type").textContent =
      patient.blood_type || "N/A";
    document.getElementById("doctor").textContent = patient.doctor || "N/A";
    document.getElementById("allergies").textContent =
      patient.allergies || "N/A";
    document.getElementById("medicines").textContent =
      patient.medicines || "N/A";
    document.getElementById("medical_history").textContent =
      patient.medical_history || "N/A";

    // Show content, hide loading
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("content").classList.remove("hidden");
  } catch (err) {
    document.getElementById("loading").textContent =
      "Failed to load patient details";
  }
}

function goToEdit() {
  window.location.href = `edit.html?id=${personId}`;
}

loadPatient();
