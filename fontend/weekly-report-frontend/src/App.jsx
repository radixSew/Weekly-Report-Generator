import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyReport from "./pages/MyReport";
import ReportDetail from "./pages/ReportDetail";
import CreateReport from "./pages/CreateReport";
import EditReport from "./pages/EditReport";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import ManagerReportReview from "./pages/Manager/ManagerReportReview";
import ReportVersions from "./pages/ReportVersions";
import ManagerReportVersions from "./pages/Manager/ManagerReportVersions";
import Projects from "./pages/Projects";
import ProjectManagement from "./pages/Manager/ProjectManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/my-reports" element={<MyReport />} />

        <Route path="/report/:id" element={<ReportDetail />} />

        <Route path="/report/create" element={<CreateReport />} />

        <Route path="/report/:id/edit" element={<EditReport />} />

        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        <Route path="/manager/reports/:id" element={<ManagerReportReview />} />

        <Route path="/report/:id/versions" element={<ReportVersions />} />

        <Route
          path="/manager/reports/:id/versions"
          element={<ManagerReportVersions />}
        />
        <Route path="/project" element={<Projects />} />
        <Route path="/projects" element={<ProjectManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
