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
        className="mb-5"
        position="bottom-right"
        closeOnClick={false}
        draggable={true}
        transition={Slide}
        newestOnTop={true}
      />
    </ApiProvider>
  );
}

export default Home;
