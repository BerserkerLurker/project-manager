import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Router from "./components/Router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./assets/styles/scss/App.scss";
import "react-chat-elements/dist/main.css";
import { AuthProvider } from "./hooks/useAuth";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import ResetPassword from "./pages/authentication/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify/:userId/:token" element={<VerifyEmail />} />
        <Route path="/resetpassword/:userId" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <div className="d-flex flex-column min-vh-100">
              <AuthProvider>
                <Header />
                <Router />
              </AuthProvider>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
