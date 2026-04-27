// app.js
const API = "http://localhost:3000/api";

// ─── Auth helpers ───────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function getUsername() {
  return localStorage.getItem("username");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

// Redirect to login if no token
function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

// Default headers for every request
function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─── Users ──────────────────────────────────────
async function login(username, password) {
  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ─── Persons ────────────────────────────────────
async function createPerson(data) {
  const res = await fetch(`${API}/persons`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}

async function getPerson(id) {
  const res = await fetch(`${API}/persons/${id}`, {
    headers: headers(),
  });
  return res.json();
}

async function updatePerson(id, data) {
  const res = await fetch(`${API}/persons/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deletePerson(id) {
  const res = await fetch(`${API}/persons/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
}

// ─── Patients ───────────────────────────────────
async function createPatient(data) {
  const res = await fetch(`${API}/patients`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}

async function getAllPatients() {
  const res = await fetch(`${API}/patients`, {
    headers: headers(),
  });
  return res.json();
}

async function getPatient(person_id) {
  const res = await fetch(`${API}/patients/${person_id}`, {
    headers: headers(),
  });
  return res.json();
}

async function updatePatient(person_id, data) {
  const res = await fetch(`${API}/patients/${person_id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deletePatient(person_id) {
  const res = await fetch(`${API}/patients/${person_id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
}
