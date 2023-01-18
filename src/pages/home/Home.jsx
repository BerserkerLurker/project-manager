import React from "react";
import { Outlet } from "react-router-dom";
import { ApiProvider } from "../../hooks/useApi";

function Home() {
  return (
    <ApiProvider>
      <main className="d-flex flex-grow-1">
        <Outlet />
      </main>
    </ApiProvider>
  );
}

export default Home;
