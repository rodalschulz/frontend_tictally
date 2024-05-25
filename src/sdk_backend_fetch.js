import { saveAs } from "file-saver";

let baseURL = "https://backenddummy2-rodschulzs-projects.vercel.app";
if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:3001";
}
const version = "v1";
const apiKey = process.env.REACT_APP_API_KEY;

// AUTHENTICATION
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
  return json;
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

// USER ACTIVITY DATA
export const getUserActivityData = async (userId, totalEntries) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/activity-data?totalEntries=${totalEntries}`,
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

export const postUserActivityData = async (userId, data) => {
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
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to post user activity data");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error posting user activity data:", error);
    throw error;
  }
};

export const deleteUserActivityData = async (userId, entryId) => {
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
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ entryId: entryId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to post user activity data");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error deleting user activity data:", error);
    throw error;
  }
};

export const patchUserActivityData = async (userId, entryId, data) => {
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
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ entryId: entryId, data: data }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to patch user activity data");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error patching user activity data:", error);
    throw error;
  }
};

export const uploadCSV = async (userId, formData) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "x-api-key": apiKey,
    };
    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/upload-csv`,
      {
        method: "POST",
        headers: headers,
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to upload CSV");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw error;
  }
};

export const downloadCSV = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/download-activity`,
      {
        headers: headers,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to download CSV");
    }
    const blob = await response.blob();
    saveAs(blob, "activity-data.csv");
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
};

// ACTIVITY DATA QUERY
export const queryUserActivityData = async (userId, queryParams) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/query-activity-data?${queryParams.toString()}`,
      {
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch members data");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching members data:", error);
    throw error;
  }
};

// USER CATEGORY CONFIG
export const getUserCategoryConfig = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/category-config`,
      {
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user category config");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching user category config:", error);
    throw error;
  }
};

export const updateUserCategoryConfig = async (userId, data) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
    const response = await fetch(
      `${baseURL}/${version}/users/${userId}/category-config`,
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ data }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update user category config");
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error updating user category config:", error);
    throw error;
  }
};
