import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api";
import "react-toastify/dist/ReactToastify.css";
import "../styles/changePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required!", { theme: "colored" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match!", { theme: "colored" });
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password must be different!", { theme: "colored" });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!", { theme: "colored" });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        "/users/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Success feedback
      toast.success(res.data?.message || "Password changed successfully! 🎉", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        icon: "✅",
        transition: "flip"
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message || 
        "Password change failed. Please try again.",
        { 
          autoClose: 5000,
          theme: "colored",
          transition: "bounce"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-change-container">
      <div className="password-change-card">
        <div className="card-header">
          <h2>Update Your Password</h2>
          <p>Secure your account with a new password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="password-form">
          <div className={`form-group ${focusedField === 'oldPassword' ? 'focused' : ''}`}>
            <label htmlFor="oldPassword">Current Password</label>
            <div className="input-wrapper">
              <input
                id="oldPassword"
                name="oldPassword"
                type={showPassword.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('oldPassword')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('old')}
                aria-label={showPassword.old ? "Hide password" : "Show password"}
              >
                {showPassword.old ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="underline"></div>
          </div>

          <div className={`form-group ${focusedField === 'newPassword' ? 'focused' : ''}`}>
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField(null)}
                minLength="8"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showPassword.new ? "Hide password" : "Show password"}
              >
                {showPassword.new ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="underline"></div>
            <div className="password-strength">
              <div 
                className={`strength-bar ${formData.newPassword.length > 0 ? 'active' : ''} ${
                  formData.newPassword.length >= 8 ? 'strong' : 'weak'
                }`}
              ></div>
              <span className="strength-text">
                {formData.newPassword.length >= 8 ? 'Strong password' : 'Weak password'}
              </span>
            </div>
          </div>

          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                minLength="8"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showPassword.confirm ? "Hide password" : "Show password"}
              >
                {showPassword.confirm ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="underline"></div>
            {formData.newPassword && formData.confirmPassword && (
              <div className={`password-match ${
                formData.newPassword === formData.confirmPassword ? 'match' : 'no-match'
              }`}>
                {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Updating Security...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;