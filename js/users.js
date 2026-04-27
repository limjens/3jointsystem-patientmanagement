// js/users.js
requireAuth();

// Admin only
if (getRole() !== "admin") {
  window.location.href = "index.html";
}

renderSidebar("Users");

async function loadUsers() {
  try {
    const users = await getAllUsers();
    renderTable(users);
  } catch (err) {
    document.getElementById("user-list").innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-8 text-center text-red-400">Failed to load users</td>
      </tr>
    `;
  }
}

function renderTable(users) {
  const tbody = document.getElementById("user-list");

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-8 text-center text-gray-400">No users found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users
    .map(
      (u) => `
    <tr class="hover:bg-gray-50 transition">
      <td class="px-6 py-4 font-medium text-gray-800">${u.username}</td>
      <td class="px-6 py-4">
        <span class="px-2 py-1 rounded-full text-xs font-medium
          ${u.role === "admin" ? "bg-blue-100 text-blue-600" : ""}
          ${u.role === "staff" ? "bg-green-100 text-green-600" : ""}
          ${u.role === "viewer" ? "bg-gray-100 text-gray-600" : ""}
        ">
          ${u.role}
        </span>
      </td>
      <td class="px-6 py-4">
        <button onclick="goToEdit(${u.id})" class="text-blue-500 hover:underline text-xs mr-3">Edit</button>
        <button onclick="confirmDelete(${u.id}, '${u.username}')" class="text-red-400 hover:underline text-xs">Delete</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function goToEdit(id) {
  window.location.href = `edit-user.html?id=${id}`;
}

async function confirmDelete(id, username) {
  if (confirm(`Are you sure you want to delete user "${username}"?`)) {
    await deleteUser(id);
    loadUsers();
  }
}

loadUsers();
