import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "../../styles/components/PageHeader.css";

function PageHeader({
  title,
  subtitle,
  name,
  role,
  showDashboard = false,
  showLogout = true,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <header className="page-header">

      <div className="page-header-content">

        {/* Left Side */}
        <div className="page-header-title">

          <h1>{title}</h1>

          {subtitle && (
            <p>{subtitle}</p>
          )}

        </div>


        {/* Right Side */}
        <div className="page-header-actions">

          {/* User Information */}
          {(name || role) && (
            <div className="page-header-user">

              <span className="page-header-user-name">
                {name || "User"}
              </span>

              <span className="page-header-user-role">
                {role || "User"}
              </span>

            </div>
          )}


          {/* Dashboard Button */}
          {showDashboard && (
            <Button
              variant="secondary"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </Button>
          )}


          {/* Logout Button */}
          {showLogout && (
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}

        </div>

      </div>

    </header>
  );
}

export default PageHeader;
