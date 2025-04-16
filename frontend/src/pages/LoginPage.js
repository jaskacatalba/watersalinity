// file: src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_UName: username, u_PName: password }),
      });

      const data = await response.json();
      console.log("Login response data:", data); // Debug: log the response data

      if (!response.ok) {
        throw new Error(data.error || "Login failed!");
      }

      // Store the authentication token, user type, first name, and userId
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userType", data.UserType);
      localStorage.setItem("userFirstName", data.first_name);
      localStorage.setItem("userId", data.userId); // Added to store the user ID

      // Store the user's Gmail in localStorage
      localStorage.setItem("userGmail", data.gmail);

      // Navigate based on UserType
      if (data.UserType === "Super Admin") {
        navigate("/admin/dashboard");
      } else if (data.UserType === "Normal User") {
        navigate("/user/dashboard");
      } else if (data.UserType === "Barangay Representative") {
        // Check if municipalityName and barangayName are returned
        const municipalityName = data.municipalityName || "";
        const barangayName = data.barangayName || "";

        if (!municipalityName || !barangayName) {
          setErrorMessage("Missing municipality or barangay information.");
          return;
        }

        // Store municipality and barangay names
        localStorage.setItem("municipalityName", municipalityName);
        localStorage.setItem("barangayName", barangayName);

        // Navigate to the Barangay Representative route
        navigate("/barangay/dashboard");
      } else {
        navigate("/guest-page");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <AnimatedLogo />
        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="inputGroup">
          <label className="label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
          />
        </div>

        <div className="inputGroup">
          <label className="label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
          />
        </div>

        <div className="forgotPassword">
          <Link to="/viewer/forgot-password" className="link">
            Forgot Password?
          </Link>
        </div>

        <button onClick={handleLogin} className="loginBtn">
          Login
        </button>

        <div className="registerLink">
          <p>
            Don't have an account?{" "}
            <Link to="/viewer/register" className="link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
