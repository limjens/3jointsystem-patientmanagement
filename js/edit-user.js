// js/edit-user.js
requireAuth();

// Admin only
if (getRole() !== "admin") {
  window.location.href = "index.html";
}

renderSidebar("Users");

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

if (!userId) window.location.href = "users.html";

// Helper functions for the new message structure
function showError(msg) {
  const errorMsg = document.getElementById("error-msg");
  const errorText = document.getElementById("error-text");
  errorText.textContent = msg;
  errorMsg.classList.remove("hidden");
  document.getElementById("success-msg").classList.add("hidden");
}

function showSuccess(msg) {
  const successMsg = document.getElementById("success-msg");
  const successText = document.getElementById("success-text");
  successText.textContent = msg;
  successMsg.classList.remove("hidden");
  document.getElementById("error-msg").classList.add("hidden");
}

function hideMessages() {
  document.getElementById("error-msg").classList.add("hidden");
  document.getElementById("success-msg").classList.add("hidden");
}

async function loadUser() {
  try {
    const users = await getAllUsers();
    const user = users.find((u) => u.id == userId);

    if (!user) {
      window.location.href = "users.html";
      return;
    }

    document.getElementById("username").value = user.username;
    document.getElementById("role").value = user.role;
  } catch (err) {
    showError("Failed to load user");
  }
}

async function saveUser() {
  const btn = document.getElementById("submit-btn");

  hideMessages();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username) {
    showError("Username is required");
    return;
  }

  if (!role) {
    showError("Please select a role");
    return;
  }

  btn.innerHTML = `
    <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
    Saving...
  `;
  btn.disabled = true;

  // Only include password if filled in
  const data = password ? { username, password, role } : { username, role };

  try {
    const { ok, data: res } = await updateUser(userId, data);

    if (ok) {
      showSuccess("User updated successfully!");
      setTimeout(() => {
        window.location.href = "users.html";
      }, 1500);
    } else {
      showError(res.message || "Failed to update user");
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Save Changes
      `;
      btn.disabled = false;
    }
  } catch (err) {
    showError("Cannot connect to server. Make sure the API is running.");
    btn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Save Changes
    `;
    btn.disabled = false;
  }
}

loadUser();
