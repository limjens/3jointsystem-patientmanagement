// js/index.js
requireAuth();
renderSidebar("Patients");

let allPatients = [];

async function loadPatients() {
  const patients = await getAllPatients();
  allPatients = [];

  for (const patient of patients) {
    const person = await getPerson(patient.person_id);
    allPatients.push({ ...patient, name: person.name });
  }

  renderTable(allPatients);
}

function renderTable(patients) {
  const tbody = document.getElementById("patient-list");

  if (patients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-8 text-center text-gray-400">No patients found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = patients
    .map(
      (p) => `
    <tr class="hover:bg-gray-50 transition">
      <td class="px-6 py-4 font-medium text-gray-800">${p.name || "N/A"}</td>
      <td class="px-6 py-4 text-gray-600">${p.blood_type || "N/A"}</td>
      <td class="px-6 py-4 text-gray-600">${p.doctor || "N/A"}</td>
      <td class="px-6 py-4 text-gray-600">${p.allergies || "N/A"}</td>
      <td class="px-6 py-4">
        <button onclick="viewPatient(${p.person_id})" class="text-blue-500 hover:underline text-xs mr-3">View</button>
        <button onclick="confirmDelete(${p.person_id})" class="text-red-400 hover:underline text-xs">Delete</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function filterPatients() {
  const search = document.getElementById("search").value.toLowerCase();
  const blood = document.getElementById("blood-filter").value;

  const filtered = allPatients.filter((p) => {
    const matchName = p.name && p.name.toLowerCase().includes(search);
    const matchBlood = blood === "" || p.blood_type === blood;
    return matchName && matchBlood;
  });

  renderTable(filtered);
}

function viewPatient(person_id) {
  window.location.href = `view.html?id=${person_id}`;
}

async function confirmDelete(person_id) {
  if (confirm("Are you sure you want to delete this patient?")) {
    await deletePatient(person_id);
    await deletePerson(person_id);
    loadPatients();
  }
}

// Attach filter listeners
document.getElementById("search").addEventListener("input", filterPatients);
document
  .getElementById("blood-filter")
  .addEventListener("change", filterPatients);

loadPatients();
