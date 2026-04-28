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
  updateStats(allPatients);
}

function renderTable(patients) {
  const tbody = document.getElementById("patient-list");
  const role = getRole();

  if (patients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center gap-2">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <p class="text-gray-400 text-sm">No patients found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = patients
    .map(
      (p) => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-sm font-medium">${p.name?.charAt(0) || "?"}</span>
          </div>
          <span class="font-medium text-gray-800">${p.name || "N/A"}</span>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">${p.blood_type || "N/A"}</span>
      </td>
      <td class="px-6 py-4 text-gray-600">${p.doctor || "N/A"}</td>
      <td class="px-6 py-4 text-gray-600">${p.allergies || "None"}</td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button onclick="viewPatient(${p.person_id})" 
            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
            title="View">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          ${
            role === "admin" || role === "staff"
              ? `
            <button onclick="editPatient(${p.person_id})" 
              class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all" 
              title="Edit">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          `
              : ""
          }
          ${
            role === "admin"
              ? `
            <button onclick="confirmDelete(${p.person_id})" 
              class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
              title="Delete">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          `
              : ""
          }
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

function updateStats(patients) {
  // Update total patients count
  const totalCount = document.getElementById("total-count");
  if (totalCount) {
    totalCount.textContent = patients.length;
  }

  // Count unique blood types
  const uniqueBloodTypes = new Set(
    patients.map((p) => p.blood_type).filter((b) => b),
  );
  const bloodTypeCount = document.getElementById("blood-count");
  if (bloodTypeCount) {
    bloodTypeCount.textContent = uniqueBloodTypes.size;
  }

  // Count unique doctors
  const uniqueDoctors = new Set(
    patients.map((p) => p.doctor).filter((d) => d && d !== "N/A"),
  );
  const doctorCount = document.getElementById("doctor-count");
  if (doctorCount) {
    doctorCount.textContent = uniqueDoctors.size;
  }

  // Count patients with allergies
  const allergyCount = patients.filter(
    (p) => p.allergies && p.allergies !== "None" && p.allergies !== "N/A",
  ).length;
  const allergyCountElem = document.getElementById("allergy-count");
  if (allergyCountElem) {
    allergyCountElem.textContent = allergyCount;
  }
}

function filterPatients() {
  const search = document.getElementById("search").value.toLowerCase() || "";
  const blood = document.getElementById("blood-filter").value || "";

  const filtered = allPatients.filter((p) => {
    const matchName = p.name && p.name.toLowerCase().includes(search);
    const matchBlood = blood === "" || p.blood_type === blood;
    return matchName && matchBlood;
  });

  renderTable(filtered);
  updateStats(filtered);
}

function viewPatient(person_id) {
  window.location.href = `view.html?id=${person_id}`;
}

function editPatient(person_id) {
  window.location.href = `edit.html?id=${person_id}`;
}

async function confirmDelete(person_id) {
  if (
    confirm(
      "Are you sure you want to delete this patient? This action cannot be undone.",
    )
  ) {
    try {
      await deletePatient(person_id);
      await deletePerson(person_id);
      loadPatients();

      // Show success message (optional)
      const successMsg = document.getElementById("success-msg");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        setTimeout(() => {
          successMsg.classList.add("hidden");
        }, 3000);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete patient. Please try again.");
    }
  }
}

function clearFilters() {
  const searchInput = document.getElementById("search");
  const bloodFilter = document.getElementById("blood-filter");

  if (searchInput) searchInput.value = "";
  if (bloodFilter) bloodFilter.value = "";

  filterPatients();
}

// Make functions global for HTML onclick
window.viewPatient = viewPatient;
window.editPatient = editPatient;
window.confirmDelete = confirmDelete;
window.clearFilters = clearFilters;

// Attach filter listeners
const searchInput = document.getElementById("search");
const bloodFilter = document.getElementById("blood-filter");

if (searchInput) {
  searchInput.addEventListener("input", filterPatients);
}
if (bloodFilter) {
  bloodFilter.addEventListener("change", filterPatients);
}

// Load patients on page load
loadPatients();
