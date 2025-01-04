import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../components/Home";
import Navbar from "../components/Navbar";
import StudentSignUp from "../components/StudentSignUp";
import StudentSignIn from "../components/StudentSignIn";
import FacultySignUp from "../components/FacultySignUp";
import FacultySignIn from "../components/FacultySignIn";
import Footer from "../components/Footer";
import FindPeople from "../components/FindPeople";
import Sidebar from "../components/Sidebar";
import FindProjects from "../components/FindProjects";
import FindStudents from "../components/FindStudents";
import KnowTeamMembers from "../components/KnowTeamMembers";
import Statistics from "../components/Statistics";
import Calendar from "../components/Calendar";
import Kanban from "../components/Kanban";
import Dashboard from "../components/Dashboard";
import ProjectDashboard from "../components/ProjectDashboard";
import ProjectListing from "../components/ProjectListing";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/student_signup",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <StudentSignUp />
        <Footer />
      </>
    ),
  },
  {
    path: "/faculty_signup",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <FacultySignUp />
        <Footer />
      </>
    ),
  },
  {
    path: "/find_people",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <FindPeople />
        <Footer />
      </>
    ),
  },
  {
    path: "/find_projects",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <FindProjects />
        <Footer />
      </>
    ),
  },
  {
    path: "/find_students",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <FindStudents />
        <Footer />
      </>
    ),
  },
  {
    path: "/know_team_members",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <KnowTeamMembers />
        <Footer />
      </>
    ),
  },
  {
    path: "/statistics",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <Statistics />
        <Footer />
      </>
    ),
  },
  {
    path: "/calendar",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <Calendar />
        <Footer />
      </>
    ),
  },
  {
    path: "/kanban",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <Kanban />
        <Footer />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <Dashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "/student_signin",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <StudentSignIn />
        <Footer />
      </>
    ),
  },
  {
    path: "/faculty_signin",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <FacultySignIn />
        <Footer />
      </>
    ),
  },
  {
    path: "/project",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <ProjectDashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "/project-listing",
    element: (
      <>
        <Navbar />
        <Sidebar />
        <ProjectListing />
        <Footer />
      </>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
