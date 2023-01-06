import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Router from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/scss/App.scss";
import { AuthProvider } from "./hooks/useAuth";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar/>
        <Router />
      </AuthProvider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
