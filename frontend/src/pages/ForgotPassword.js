import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/blue2.jpg";

const ForgotPassword = () => {
  //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert("A reset link has been sent to your email.");
    navigate("/login");
  };

  //const users = [
  //  { username: "admin", password: "password", redirectTo: "/admin/dashboard" },
  //  { username: "ticad", password: "barangay", redirectTo: "/userticad/ticad" },
  //  { username: "guest", password: "guest123", redirectTo: "/guest-page" }
  //];
  
  //const handleLogin = () => {
  //  if (!username || !password) {
  //    alert("Please fill in all fields.");
  //    return;
  //  }
  
    // Check if user exists in the list
  //  const validUser = users.find(user => user.username === username && user.password === password);
  
 //   if (validUser) {
 //     localStorage.setItem("auth", "true");
 //     navigate(validUser.redirectTo); // Navigate to different pages
 //   } else {
 //     alert("Invalid credentials!");
 //   }
 // };

 // const handleKeyDown = (event) => {
 //   if (event.key === "Enter") {
 //     handleLogin();
 //   }
 // };

  return (
    <div>
      {/* Header Section */}
      {/*<div style={styles.header}>
        <div style={styles.logo}>BLUE</div>
        <div style={styles.logoContainer}>
          <img src={loginImage} alt="Blue Logo" style={styles.logoImage} />
          <div style={styles.logoText}>LUE</div>
        </div>
        <div style={styles.loginForm}>
          <input type="username" placeholder="Ente your Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} style={styles.headerInput} />
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}  style={styles.headerInput} />
          <button onClick={handleLogin} style={styles.loginButton}>Login</button>
          <a href="/forgot-password" style={styles.forgotLink}>Forgot Account?</a>
        </div>
      </div>*/}

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Reset?</h2>
          <p style={styles.description}>
            Please enter your email or mobile number to Reset.
          </p>
          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => navigate("/viewer/LoginPage")}
              >
                Cancel
              </button>
              <button type="submit" style={styles.searchButton}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "royalblue",
    padding: "14px",
    borderBottom: "1px solid #ddd",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    marginTop: "2px",
    width: "65px", // Adjust size as needed
    height: "65px",
    marginRight: "0px",
    borderRadius: "10px",
  },
  logoText: {
    width: "50px",
    height: "35px",
    fontFamily: "auto",
    fontSize: "24px",
    color: "white",
  },
  //logo: {
  //  fontSize: "28px",
  //  fontWeight: "bold",
  //  color: "#1877f2",
  //  fontFamily: "Arial, sans-serif",
  //},
  loginForm: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  headerInput: {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  loginButton: {
    backgroundColor: "darkblue",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#1877f2",
    textDecoration: "none",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    //backgroundColor: "#f0f2f5",
  },
  box: {
    backgroundColor: "royalblue",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "400px",
  },
  title: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "white",
    marginBottom: "15px",
  },
  input: {
    width: "95%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#E4E6EB",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  searchButton: {
    backgroundColor: "darkblue",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default ForgotPassword;
