
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';


import { useAuth } from "./contexts/AuthContext.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import HomePage from "./components/HomePage.jsx";
import DebugPage from "./components/DebugPage.jsx";
import UploadVideo from "./components/UploadVideo.jsx";
import AccountPage from "./components/AccountPage.jsx";
import VideoList from "./components/VideoList.jsx";
import ProtectedLayout from "./components/ProtectedLayout.jsx";
import UpdateAccount from "./components/UpdateAccount.jsx";

import ChangePassword from "./components/ChangePassword.jsx";




const App = () => {
  const { loading } = useAuth();

  

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="/updateaccount" element={<UpdateAccount />} />

      {/*  Protected routes */}
      <Route path="/home" element={<ProtectedLayout><HomePage /></ProtectedLayout>} />
      <Route path="/upload" element={<ProtectedLayout><UploadVideo /></ProtectedLayout>} />
      <Route path="/c/:username" element={<ProtectedLayout><AccountPage /></ProtectedLayout>} />
      <Route path="/videos" element={<ProtectedLayout><VideoList /></ProtectedLayout>} />
<Route path="/change-password" element={<ProtectedLayout><ChangePassword /></ProtectedLayout>} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};

export default App;
