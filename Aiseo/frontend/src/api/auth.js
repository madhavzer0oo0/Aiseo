import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth";

/**
 * Register user
 */
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Registration failed";
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data; // { access_token, token_type }
  } catch (error) {
    throw error.response?.data?.detail || "Login failed";
  }
};

/**
 * Get current user
 */
export const getMe = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch {
    throw "Not authenticated";
  }
};
