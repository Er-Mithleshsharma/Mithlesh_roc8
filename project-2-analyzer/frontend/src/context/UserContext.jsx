// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create UserContext
const UserContext = createContext();

// UserProvider component to wrap the application and provide user context
export const UserProvider = ({ children }) => {
  const [error, setError] = useState(null); // Error state for handling authentication errors
  const [loading, setLoading] = useState(false); // Loading state
  const [user, setUser] = useState(null); // User state to store authenticated user data
  const navigate = useNavigate();

  // Check for stored user authentication on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser)); // Parse the stored user data and set the user state
    }
  }, []); // No dependencies needed as this runs only on the initial render

  // Function to register a new user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/register`,
        userData
      );

      const { user, token } = response.data;

      // Save user data and token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); // Update user state with registered user data
      navigate("/"); // Redirect to homepage or dashboard after successful registration

      return response.data; // Return the response for further use if needed
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred during registration."
      );
      console.error(err);
    } finally {
      setLoading(false); // Ensure loading stops after request is complete
    }
  };

  // Function to log in an existing user
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login`,
        credentials
      );

      const { user, token } = response.data;

      // Save user data and token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); // Update user state with logged-in user data
      navigate("/"); // Redirect to homepage or dashboard after successful login

      return response.data; // Return the response for further use if needed
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred during login."
      );
      console.error(err);
    } finally {
      setLoading(false); // Ensure loading stops after request is complete
    }
  };

  // Function to log out the user
  const logoutUser = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("user"); // Clear user data from local storage
    setUser(null); // Reset user state
    navigate("/login"); // Redirect to login page after logging out
  };

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!user && !!token;
  };

  // Function to get the authentication token
  const getToken = () => localStorage.getItem("token");

  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        logoutUser,
        isAuthenticated,
        getToken,
        error,
        loading,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
