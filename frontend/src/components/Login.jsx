import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";


const Login = ({}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
     email: "",
     password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Step 1: Login
    const res = await API.post("/users/login", form, { withCredentials: true });
    console.log(" Login Response:", res);
    console.log(" Cookies after login (visible):", document.cookie);

    // Step 2: WAIT for /me
   const meRes = await API.get("/users/me", { withCredentials: true });
    console.log(" User from /me:", meRes.data);

    // Optional: store in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(meRes.data));

    // Success
    alert("Login successful!");
    navigate("/home");
  } catch (err) {
    console.error(" Login or /me failed:", err);
    alert(err.response?.data?.message || "Login failed.");
  }
};


  return (
   <div className="login-classic">
      <nav className="nav-classic">
        <h1 className="brand-classic">SportsX</h1>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Login</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <div className="login-content" data-aos="fade-up">
        <div className="text-zone">
          <h2 className="headline">Tweet It. Talk It. Live It.</h2>
          <h1 className="mainline">This Is Your Home for Sports.</h1>
          <p className="tagline">Real sports. Real people. Real community</p>
          <p className="subline">Your Sports Journey Starts Here!! Enter your email</p>

          <form className="form-classic" onSubmit={handleSubmit} data-aos="zoom-in">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
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
            <button type="submit">Login &gt;</button>
          </form>
        </div>
        <div className="visual-zone" data-aos="zoom-in">
          <div className="circle-decor"></div>
          <div className="gradient-ring"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
