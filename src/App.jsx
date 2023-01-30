import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Router from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/scss/App.scss";
import { AuthProvider } from "./hooks/useAuth";
function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <AuthProvider>
          <Header />
          <Router />
        </AuthProvider>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
