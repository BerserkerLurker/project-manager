import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "../pages/authentication/Login";
import SignUp from "../pages/authentication/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import NoMatch from "../pages/error/NoMatch";
import Home from "../pages/home/Home";

function AuthenticatedRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      return navigate("/login", { replace: true });
    }
    return navigate("/", { replace: true });
  }, [user]);
  return <Home />;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatedRoute />}>
        <Route index element={<Dashboard />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default Router;
