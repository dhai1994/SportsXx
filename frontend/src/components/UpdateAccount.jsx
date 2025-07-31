import React from "react";
import Beams from "../blocks/Backgrounds/Beams/Beams";

const UpdateAccount = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <Beams />
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "2rem",
        borderRadius: "12px",
        zIndex: 10,
        color: "white"
      }}>
        <h2>Update Account</h2>
        <form>
          <input type="text" placeholder="New Username" style={{ margin: 8 }} />
          <br />
          <input type="email" placeholder="New Email" style={{ margin: 8 }} />
          <br />
          <button type="submit" style={{ margin: 8 }}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
