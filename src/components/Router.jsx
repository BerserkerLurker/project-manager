import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "../pages/authentication/Login";
import SignUp from "../pages/authentication/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import NoMatch from "../pages/error/NoMatch";
import Home from "../pages/home/Home";
import Messages from "../pages/dashboard/Messages";
import Calendar from "../pages/dashboard/Calendar";
import Boards from "../pages/dashboard/Boards";
import Project from "../pages/dashboard/Project";
import NewProject from "../pages/dashboard/NewProject";
import Tasks from "../pages/dashboard/Tasks";
import Teams from "../pages/dashboard/Teams";
import { default as socket } from "../api/socket/socket";

function AuthenticatedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  // @ts-ignore
  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      globalThis.socket = socket(user);
    }
    if (globalThis.socket) {
      globalThis.socket.connect();
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      if (location.pathname === "/signup") {
        return navigate("/signup", { replace: true });
      } else {
        return navigate("/login", { replace: true });
      }
    }
    return navigate(location.pathname, { replace: true });
  }, [user, location.pathname]);
  return <Home />;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatedRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="project/:id" element={<Project />} />
          <Route path="newproject" element={<NewProject />} />
          <Route path="boards" element={<Boards />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="messages" element={<Messages />} />
          <Route path="teams" element={<Teams />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default Router;
