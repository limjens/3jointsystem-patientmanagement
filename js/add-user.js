// js/add-user.js
requireAuth();

// Admin only
if (getRole() !== "admin") {
  window.location.href = "index.html";
}

renderSidebar("Users");

async function addUser() {
  const errorMsgDiv = document.getElementById("error-msg");
  const errorText = document.getElementById("error-text");
  const successMsgDiv = document.getElementById("success-msg");
  const successText = document.getElementById("success-text");
  const btn = event.currentTarget;

  // Hide messages
  errorMsgDiv.classList.add("hidden");
  successMsgDiv.classList.add("hidden");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  // Validate
  if (!username) {
    errorText.textContent = "Username is required";
    errorMsgDiv.classList.remove("hidden");
    return;
  }
  if (!password) {
    errorText.textContent = "Password is required";
    errorMsgDiv.classList.remove("hidden");
    return;
  }
  if (password.length < 6) {
    errorText.textContent = "Password must be at least 6 characters";
    errorMsgDiv.classList.remove("hidden");
    return;
  }
  if (!role) {
    errorText.textContent = "Please select a role";
    errorMsgDiv.classList.remove("hidden");
    return;
  }

  // Save original button text
  const originalText = btn.innerHTML;
  btn.innerHTML = `
    <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
    Saving...
  `;
  btn.disabled = true;

  try {
    const { ok, data } = await registerUser({ username, password, role });

    if (ok) {
      successText.textContent = `User "${username}" created successfully!`;
      successMsgDiv.classList.remove("hidden");
      setTimeout(() => {
        window.location.href = "users.html";
      }, 1500);
    } else {
      errorText.textContent = data.message || "Failed to create user";
      errorMsgDiv.classList.remove("hidden");
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  } catch (err) {
    console.error("Error:", err);
    errorText.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsgDiv.classList.remove("hidden");
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// Make addUser available globally
window.addUser = addUser;
