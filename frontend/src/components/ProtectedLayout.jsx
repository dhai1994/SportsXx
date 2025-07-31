import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedLayout = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <p style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to right, #ff0055, #7f00ff)",
        color: "white",
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default ProtectedLayout;
