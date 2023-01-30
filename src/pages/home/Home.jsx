import React from "react";
import { Outlet } from "react-router-dom";
import { ApiProvider } from "../../hooks/useApi";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  return (
    <ApiProvider>
      <main className="d-flex flex-grow-1">
        <Outlet />
      </main>
      <ToastContainer
        closeOnClick={false}
        draggable={true}
        transition={Slide}
      />
    </ApiProvider>
  );
}

export default Home;
