
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");

    // ----------------------------------------
    // Validate input
    // ----------------------------------------

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {

      setLoading(true);

      // ----------------------------------------
      // Login API
      // ----------------------------------------

      const response = await api.post("/Auth/login", {
        email: email.trim(),
        password: password
      });

      console.log("Login response:", response.data);

      const data = response.data;

      // ----------------------------------------
      // Save login information
      // ----------------------------------------

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      console.log("Logged-in role:", data.role);

      // ----------------------------------------
      // ROLE-BASED NAVIGATION
      // ----------------------------------------

      if (data.role === "Manager") {

        // Manager Dashboard
        navigate("/manager/dashboard");

      } else if (data.role === "Admin") {

        // Admin Dashboard
        navigate("/manager/dashboard");

      } else if (data.role === "TeamMember") {

        // Team Member Dashboard
        navigate("/dashboard");

      } else {

        // Unknown role
        setError("Invalid user role.");

        // Remove saved login information
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
      }

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {

        setError(
          error.response.data?.message ||
          "Invalid email or password."
        );

      } else {

        setError(
          "Unable to connect to the server."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Weekly Report</h1>

        <p className="login-subtitle">
          Sign in to your account
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>


          {/* Password */}
          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* Register */}
        <p className="register-text">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;

