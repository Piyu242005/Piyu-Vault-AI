const API_URL = "http://localhost:8000";

export async function getUser() {
  try {
    const res = await fetch(`${API_URL}/api/user`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user from Python API:", error);
    return null;
  }
}
