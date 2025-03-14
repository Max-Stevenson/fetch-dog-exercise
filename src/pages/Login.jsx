import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.scss";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        console.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
