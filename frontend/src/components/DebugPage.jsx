import React from "react";
import API from "../api";

const DebugPage = () => {
  const testCookies = async () => {
    try {
      const res = await API.get("/debug-cookies");
      console.log("🍪 Cookie result from backend:", res.data);
    } catch (err) {
      console.error("❌ Cookie test failed:", err);
    }
  };

  return (
    <div>
      <h1>Debug Cookie Test</h1>
      <button onClick={testCookies}>Check Cookies</button>
    </div>
  );
};

export default DebugPage;
