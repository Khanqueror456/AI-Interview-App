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
import Resumes from "../pages/Resumes";
import ResumeDetails from "../pages/ResumeDetails";
import JobMatchs from "../pages/JobMatchs";
import JobSearch from "../pages/JobSearch";
import JobMatchList from "../pages/JobMatchList";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import MyInterviews from "../pages/MyInterviews";

import ScrollToTop from "../components/utils/ScrollToTop.jsx";


const AppRoutes = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/interviews/" element={<MyInterviews />} />
            <Route path="/interviews/create" element={<CreateInterview />} />
            <Route path="/interviews/:id" element={<Interview />} />
            <Route path="/interviews/:id/report" element={<Report />} />
            <Route path="/interviews/questions/:id/analysis" element={<QuestionAnalysis />} />
            <Route path="/resume/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/resumes/:id/report" element={<ResumeReport />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/resumes/:id" element={<ResumeDetails />} />
            <Route path="/resumes/job-search/:id" element={<JobSearch />} />
            <Route path="/resumes/job-matches/:id" element={<JobMatchs />} />
            <Route path="/resumes/jobs-matches/:id" element={<JobMatchList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
