let baseURL = "https://backenddummy2-rodschulzs-projects.vercel.app";
if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:3001";
}
const version = "v1";
const apiKey = process.env.REACT_APP_API_KEY;

export const registerUser = async (email, username, password) => {
  const response = await fetch(`${baseURL}/${version}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ email, username, password }),
  });
  const json = await response.json();
  return json.user;
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${baseURL}/${version}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  return json;
};

export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
    const response = await fetch(`${baseURL}/${version}/auth`, {
      headers: headers,
    });
    const json = await response.json();
    return json.response === true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    throw error;
  }
};

export const getUserActivityData = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/activity-data`,
      {
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }

    const json = await response.json();
    return json.userActivityData;
  } catch (error) {
    console.error("Error fetching members data:", error);
    throw error;
  }
};
