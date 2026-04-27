// js/login.js

// Already logged in? skip to dashboard
if (getToken()) {
  window.location.href = "index.html";
}

async function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");
  const btn = document.getElementById("login-btn");

  // Clear previous error
  errorMsg.classList.add("hidden");

  // Validate
  if (!username || !password) {
    errorMsg.textContent = "Please enter username and password";
    errorMsg.classList.remove("hidden");
    return;
  }

  // Loading state
  btn.textContent = "Signing in...";
  btn.disabled = true;

  try {
    const { ok, data } = await login(username, password);

    if (ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = data.message || "Invalid username or password";
      errorMsg.classList.remove("hidden");
      btn.textContent = "Sign In";
      btn.disabled = false;
    }
  } catch (err) {
    errorMsg.textContent =
      "Cannot connect to server. Make sure the API is running.";
    errorMsg.classList.remove("hidden");
    btn.textContent = "Sign In";
    btn.disabled = false;
  }
}

// Press Enter to login
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});
