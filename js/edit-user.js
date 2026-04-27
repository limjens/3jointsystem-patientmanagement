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
    document.getElementById("error-msg").textContent = "Failed to load user";
    document.getElementById("error-msg").classList.remove("hidden");
  }
}

async function saveUser() {
  const errorMsg = document.getElementById("error-msg");
  const successMsg = document.getElementById("success-msg");
  const btn = document.getElementById("submit-btn");

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username) {
    errorMsg.textContent = "Username is required";
    errorMsg.classList.remove("hidden");
    return;
  }

  if (!role) {
    errorMsg.textContent = "Please select a role";
    errorMsg.classList.remove("hidden");
    return;
  }

  btn.textContent = "Saving...";
  btn.disabled = true;

  // Only include password if it was filled in
  const data = password ? { username, password, role } : { username, role };

  try {
    const { ok, data: res } = await updateUser(userId, data);

    if (ok) {
      successMsg.textContent = "User updated successfully!";
      successMsg.classList.remove("hidden");
      setTimeout(() => {
        window.location.href = "users.html";
      }, 1500);
    } else {
      errorMsg.textContent = res.message || "Failed to update user";
      errorMsg.classList.remove("hidden");
      btn.textContent = "Save Changes";
      btn.disabled = false;
    }
  } catch (err) {
    errorMsg.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsg.classList.remove("hidden");
    btn.textContent = "Save Changes";
    btn.disabled = false;
  }
}

loadUser();
