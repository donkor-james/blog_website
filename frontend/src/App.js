import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Verification from "./pages/Verfication";
import ConfirmVerification from "./pages/ConfirmVerifycation";
import ResendVerification from "./pages/ResendVerification";
import ProtectRoutes from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PostsManagement from "./pages/Posts";
import Profile from "./pages/Profile";

function App() {
  return (
    // <div>Routing</div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route
          path="verify-account/:uidb64/:token"
          element={<ConfirmVerification />}
        />
        <Route path="/resend-verification" element={<ResendVerification />} />

        <Route element={<ProtectRoutes />}>
          <Route element={<Dashboard />} path="/dashboard">
            <Route
              index
              element={<Navigate to={"/dashboard/posts"} replace />}
            />
            <Route path="posts" element={<PostsManagement />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
