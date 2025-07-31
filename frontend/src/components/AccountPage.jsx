import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../api";
import "../styles/AccountPage.css";
import { useParams, useNavigate } from "react-router-dom";

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use the authenticated user's data directly since your original code worked this way
        const res = await API.get("/users/me", { withCredentials: true });
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to match your working version

  if (!profileData) return <div>Loading profile...</div>;

  const { name, avatar, videos = [], subscribers = 0 } = profileData;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="account-container">
      <div className="account-sidebar">
        <div className="sidebar-top">
          <div className="profile-pic">
            <img src={avatar || "/default-avatar.png"} alt="Avatar" />
          </div>
          <h3>{user?.fullname || name || "User"}</h3>
          <p className="username">@{user?.username || "not-found"}</p>

          <button 
            className="update-btn"
            onClick={() => navigate("/update-profile")}
          >
            Update Info
          </button>
        </div>
        <div className="sidebar-links">
          <div>My profile</div>
          <div>Uploaded</div>
          <div>Favorites</div>
          <div onClick={() => navigate("/upload")}>Upload video</div>
        </div>
        <div className="sidebar-bottom">
          <div>Settings</div>
          <div onClick={handleLogout}>Log out</div>
        </div>
      </div>

      <div className="account-content">
        <div className="account-stats">
          <div><strong>{videos.length}</strong> Videos</div>
          <div><strong>{subscribers}</strong> Subscribers</div>
        </div>

        <div className="account-tabs">
          <div className="tab active">My Videos</div>
          <div className="tab">Favorites</div>
          <div className="tab">Watch Later</div>
        </div>

        <div className="video-category-list">
          {videos.slice(0, 6).map((video) => (
            <div className="video-category" key={video._id}>
              <h4>{video.title}</h4>
              <p>{video.likes} likes</p>
            </div>
          ))}
        </div>

        <div className="upgrade-box">
          <button className="upgrade-btn">Upgrade Plan</button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;