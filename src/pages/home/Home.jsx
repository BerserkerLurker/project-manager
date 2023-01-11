import React from "react";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <main className="d-flex flex-grow-1">
      <Outlet />
    </main>
  );
}

export default Home;
