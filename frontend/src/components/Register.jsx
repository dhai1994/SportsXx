import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
//import "../styles/register.css"


import Beams from "../blocks/Backgrounds/Beams/Beams.jsx"

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  })

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (e.target.name === "avatar") {
      setAvatar(file);
    } else if (e.target.name === "coverImage") {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", form.fullname)
    formData.append("username", form.username)
    formData.append("email", form.email)
    formData.append("password", form.password)
    if (avatar) formData.append("avatar", avatar)
    if (coverImage) formData.append("CoverImage", coverImage)

    try {
      const res = await API.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      alert("Registration successful! Please log in.")
      navigate("/login")
    } catch (err) {
      console.error("Registration error:", err)
      alert(err.response?.data?.message || "Error during registration.")
    }
  }

  return (
  <>
  <div className="register-form-container">
      <div className="beams-wrapper">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="black-box"></div>

      <div className="login-classic">
        <nav className="nav-classic">
          <h1 className="brand-classic">SportsX</h1>
          <div className="nav-links">
            <a href="#">Home</a>
            <a onClick={() => navigate("/login")}>Login</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </nav>

        <div className="login-content" data-aos="fade-up">
          <div className="text-zone">
            <h2 className="headline">Welcome to SportsX</h2>
            <h1 className="mainline">Create Your Free Account</h1>
            <p className="tagline">Join the community of passionate players</p>
            <p className="subline">Fill out the fields to get started</p>

            <form
              className="form-classic"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              data-aos="zoom-in"
            >
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={form.fullname}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label className="upload-label">Upload Avatar</label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                required
              />

              <label className="upload-label">Upload Cover Image</label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                required
              />

              <button type="submit">Register &gt;</button>
            </form>
          </div>

          <div className="visual-zone" data-aos="zoom-in">
            <div className="circle-decor"></div>
            <div className="gradient-ring"></div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Register;