// src/components/VideoList.jsx

import React from "react";
import { useAuth } from "../contexts/AuthContext";

const VideoList = () => {
  const { user } = useAuth();

  if (!user || !user.videos) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h2>Your Uploaded Videos</h2>

      {user.videos.length === 0 ? (
        <p>You haven’t uploaded any videos yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {user.videos.map((video) => (
            <div key={video._id} style={{ backgroundColor: "#1a1a1a", padding: "15px", borderRadius: "10px" }}>
              <video src={video.videoFile.url} controls style={{ width: "100%", borderRadius: "8px" }} />
              <p><strong>{video.title}</strong></p>
              <p>{video.views} views</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
