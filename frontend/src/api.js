const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export async function login(id, pw) {
  try {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function signup(id, pw) {
  try {
    const res = await fetch(`${BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function allStudent() {
  try {
    const res = await fetch(`${BASE}/people`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function getStudent(id) {
  try {
    const res = await fetch(`${BASE}/people/${id}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function update(id, name, tag, description, cost) {
  try {
    const res = await fetch(`${BASE}/people/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, tag, description, cost }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function call(callerId, targetIds, reason) {
  try {
    const res = await fetch(`${BASE}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callerId, targetIds, reason }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getStudentActivity(studentId) {
  try {
    const res = await fetch(`${BASE}/api/student-activity/${studentId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching student activity:", error);
    return null;
  }
}