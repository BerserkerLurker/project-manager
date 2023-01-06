import React, { useContext } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div>
        Navbar
        <Link to="/login">Login</Link>
        <span> </span>
        <Link to="/signup">SignUp</Link>
      </div>
    );
  }
  return (
    <div>
      Navbar {user ? `Welcome ${user.name}` : ""}
      <span> </span>
      <Link to="/profile">Profile</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;
