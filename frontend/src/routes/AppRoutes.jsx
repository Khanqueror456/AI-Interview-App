import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateInterview from "../pages/CreateInterview";
import Interview from "../pages/Interview";
import Report from "../pages/Report";
import QuestionAnalysis from "../pages/QuestionAnalysis";
import ResumeAnalyzer from "../pages/ResumeAnalyzer";
import ResumeReport from "../pages/ResumeReport";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/interviews/create" element={<CreateInterview />} />
            <Route path="/interviews/:id" element={<Interview />} />
            <Route path="/interviews/:id/report" element={<Report />} />
            <Route path="/interviews/questions/:id/analysis" element={<QuestionAnalysis />} />
            <Route path="/resume/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/resumes/:id/report" element={<ResumeReport />}
/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
