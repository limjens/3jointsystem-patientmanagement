// js/add-user.js
requireAuth();

// Admin only
if (getRole() !== "admin") {
  window.location.href = "index.html";
}

renderSidebar("Users");

async function addUser() {
  const errorMsg = document.getElementById("error-msg");
  const successMsg = document.getElementById("success-msg");
  const btn = document.getElementById("submit-btn");

  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // Validate
  if (!username) {
    errorMsg.textContent = "Username is required";
    errorMsg.classList.remove("hidden");
    return;
  }
  if (!password) {
    errorMsg.textContent = "Password is required";
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

  try {
    const { ok, data } = await registerUser({ username, password, role });

    if (ok) {
      successMsg.textContent = `User "${username}" created successfully!`;
      successMsg.classList.remove("hidden");
      setTimeout(() => {
        window.location.href = "users.html";
      }, 1500);
    } else {
      errorMsg.textContent = data.message || "Failed to create user";
      errorMsg.classList.remove("hidden");
      btn.textContent = "Add User";
      btn.disabled = false;
    }
  } catch (err) {
    errorMsg.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsg.classList.remove("hidden");
    btn.textContent = "Add User";
    btn.disabled = false;
  }
}
