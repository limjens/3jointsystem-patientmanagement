const API = "http://localhost:3000/api";

//PERSONS
async function createPerson(data) {
  const res = await fetch(`${API}/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function getPerson(id) {
  const res = await fetch(`${API}/persons/${id}`);
  return res.json();
}

async function updatePerson(id, data) {
  const res = await fetch(`${API}/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deletePerson(id) {
  const res = await fetch(`${API}/persons/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

//PATIENTS

async function createPatient(data) {
  const res = await fetch(`${API}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function getAllPatients() {
  const res = await fetch(`${API}/patients`);
  return res.json();
}

async function getPatient(person_id) {
  const res = await fetch(`${API}/patients/${person_id}`);
  return res.json();
}

async function updatePatient(person_id, data) {
  const res = await fetch(`${API}/patients/${person_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function deletePatient(person_id) {
  const res = await fetch(`${API}/patients/${person_id}`, {
    method: "DELETE",
  });
  return res.json();
}
