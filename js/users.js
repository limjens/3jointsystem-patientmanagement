// js/users.js
requireAuth();

// Admin only
if (getRole() !== "admin") {
  window.location.href = "index.html";
}

renderSidebar("Users");

let allUsers = [];

async function loadUsers() {
  try {
    const users = await getAllUsers();
    allUsers = users;
    renderTable(allUsers);
    updateStats(allUsers);
  } catch (err) {
    document.getElementById("user-list").innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center gap-2">
            <svg class="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-400 text-sm">Failed to load users</p>
          </div>
        </td>
      </tr>
    `;
  }
}

function updateStats(users) {
  // Total users
  const totalUsers = document.getElementById("total-users");
  if (totalUsers) totalUsers.textContent = users.length;

  // Count by role
  const adminCount = users.filter((u) => u.role === "admin").length;
  const staffCount = users.filter((u) => u.role === "staff").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  const adminElem = document.getElementById("admin-count");
  const staffElem = document.getElementById("staff-count");
  const viewerElem = document.getElementById("viewer-count");

  if (adminElem) adminElem.textContent = adminCount;
  if (staffElem) staffElem.textContent = staffCount;
  if (viewerElem) viewerElem.textContent = viewerCount;
}

function renderTable(users) {
  const tbody = document.getElementById("user-list");

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center gap-2">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <p class="text-gray-400 text-sm">No users found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users
    .map(
      (u) => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-purple-600 text-sm font-medium">${u.username?.charAt(0).toUpperCase() || "U"}</span>
          </div>
          <span class="font-medium text-gray-800">${u.username}</span>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold
          ${u.role === "admin" ? "bg-blue-100 text-blue-700" : ""}
          ${u.role === "staff" ? "bg-green-100 text-green-700" : ""}
          ${u.role === "viewer" ? "bg-gray-100 text-gray-700" : ""}
        ">
          ${u.role === "admin" ? "👑 " : ""}
          ${u.role === "staff" ? "👔 " : ""}
          ${u.role === "viewer" ? "👁️ " : ""}
          ${u.role}
        </span>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button onclick="goToEdit(${u.id})" 
            class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all" 
            title="Edit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button onclick="confirmDelete(${u.id}, '${u.username}')" 
            class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
            title="Delete">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

function filterUsers() {
  const searchTerm =
    document.getElementById("search-users")?.value.toLowerCase() || "";
  const roleFilter = document.getElementById("role-filter")?.value || "";

  const filtered = allUsers.filter((u) => {
    const matchesSearch = u.username?.toLowerCase().includes(searchTerm);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  renderTable(filtered);
  updateStats(filtered);
}

function clearUserFilters() {
  const searchInput = document.getElementById("search-users");
  const roleFilter = document.getElementById("role-filter");

  if (searchInput) searchInput.value = "";
  if (roleFilter) roleFilter.value = "";

  filterUsers();
}

function goToEdit(id) {
  window.location.href = `edit-user.html?id=${id}`;
}

async function confirmDelete(id, username) {
  if (
    confirm(
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
    )
  ) {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user. Please try again.");
    }
  }
}

// Make functions global
window.goToEdit = goToEdit;
window.confirmDelete = confirmDelete;
window.clearUserFilters = clearUserFilters;
window.filterUsers = filterUsers;

// Attach event listeners
const searchInput = document.getElementById("search-users");
const roleFilter = document.getElementById("role-filter");

if (searchInput) {
  searchInput.addEventListener("input", filterUsers);
}
if (roleFilter) {
  roleFilter.addEventListener("change", filterUsers);
}

// Load users on page load
loadUsers();
