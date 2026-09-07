import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TeamMember");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Send registration data to backend
      const response = await api.post("/Auth/register", {
        name: name,
        email: email,
        password: password,
        role: role
      });

      console.log("Register response:", response.data);

      // Show success message
      setSuccess("Registration successful! You can now login.");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setRole("TeamMember");

      // Go to login page after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Register error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          "Registration failed."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your Weekly Report account
        </p>

        {/* Error message */}
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="register-success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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
              onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="TeamMember">
                Team Member
              </option>

              <option value="Manager">
                Manager
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          {/* Register button */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        {/* Login link */}
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;