import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import UsersDashboard from "./pages/UsersDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem('oidc'));

  // Update the token state whenever it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('oidc'));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('oidc');
    setToken(null); // Update the state after removing token
  };

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="login"
            element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} /> }
          />
          <Route
            path="dashboard"
            element={token ? <UsersDashboard handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
