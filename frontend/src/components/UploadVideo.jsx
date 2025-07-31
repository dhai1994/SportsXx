import React, { useState } from "react";
import API from "../api";
import "../styles/upload.css";
import { useAuth } from "../contexts/AuthContext";
import Stepper, { Step } from "../blocks/Components/Stepper/Stepper.jsx";

const UploadVideo = () => {
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      
      // Get video duration
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        setVideoDuration(Math.round(videoElement.duration));
      };
    }
  };

  const handleUpload = async () => {
    if (!video || !thumbnail || !title) {
      return alert("Please complete all required fields");
    }

    const formData = new FormData();
    formData.append("videoFile", video);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await API.post("/videos/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      setUploadedVideo(res.data.data);
      setUploadProgress(0);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  return (
    <div className="dark-theme">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Your Video</h2>
          <p className="subtitle">Share your content with the community</p>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          </div>
        )}

        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleUpload}
          nextButtonText="Continue"
          backButtonText="Back"
          completeButtonText="Publish Video"
        >
          {/* Step 1: Video Upload */}
          <Step title="Select Video">
            <div className="upload-section">
              <label className="file-upload-label">
                <div className="upload-box">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="file-input"
                  />
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24">
                      <path d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z"/>
                    </svg>
                    <h3>Drag & drop video file or click to browse</h3>
                    <p>MP4, WebM or MOV. Max 500MB.</p>
                  </div>
                </div>
              </label>

              {video && (
                <div className="video-preview-container">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="video-preview"
                  />
                  <div className="video-info">
                    <span>{video.name}</span>
                    <span>{(video.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>{videoDuration}s</span>
                    <span>{video.type.split('/')[1].toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          </Step>

          {/* Step 2: Video Details */}
          <Step title="Video Details">
            <div className="form-section">
              <div className="form-group">
                <label className="input-label">Video Title *</label>
               <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
              </div>

              <div className="form-group">
                <label className="input-label">Description</label>
                <textarea
                  placeholder="Tell viewers about your video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-area"
                  rows={5}
                />
                <p className="input-hint">Optional but recommended</p>
              </div>
            </div>
          </Step>

          {/* Step 3: Thumbnail */}
          <Step title="Thumbnail">
            <div className="thumbnail-section">
              <label className="thumbnail-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="file-input"
                />
                {thumbnail ? (
                  <div className="thumbnail-preview-container">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail preview"
                      className="thumbnail-preview"
                    />
                    <div className="thumbnail-overlay">
                      <svg className="replace-icon" viewBox="0 0 24 24">
                        <path d="M21.5,12H16.2L18.2,14H21.5A1.5,1.5 0 0,1 23,15.5V17A1.5,1.5 0 0,1 21.5,18.5H18.2L20.2,20.5H21.5A3.5,3.5 0 0,0 25,17V15.5A3.5,3.5 0 0,0 21.5,12M12.45,7.65L14.45,9.65L13,11L8,6L13,1L11.55,2.45L9.55,4.45L12,4.45A5.5,5.5 0 0,1 17.5,9.95V11.5H19.5V9.95A7.5,7.5 0 0,0 12,2.45L12.45,7.65Z"/>
                      </svg>
                      <span>Replace Thumbnail</span>
                    </div>
                  </div>
                ) : (
                  <div className="thumbnail-placeholder">
                    <svg className="image-icon" viewBox="0 0 24 24">
                      <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                    </svg>
                    <h3>Upload Thumbnail</h3>
                    <p>Recommended: 1280x720 pixels</p>
                  </div>
                )}
              </label>
            </div>
          </Step>

          {/* Step 4: Review */}
          <Step title="Review & Publish">
            <div className="review-section">
              <h3 className="review-title">Ready to publish your video</h3>
              <p className="review-subtitle">Review your details before publishing</p>

              <div className="video-review">
                {video && (
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="review-video"
                  />
                )}
              </div>

              <div className="details-review">
                <div className="detail-item">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{title}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{description || "None"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Thumbnail:</span>
                  <span className="detail-value">
                    {thumbnail ? "Selected" : "Not selected"}
                  </span>
                </div>
              </div>
            </div>
          </Step>
        </Stepper>

        {uploadedVideo && (
          <div className="success-section">
            <div className="success-message">
              <svg className="success-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
              <h3>Video Published Successfully!</h3>
              <p>Your video is now live on the platform</p>
            </div>

            <div className="published-video">
              <video
                src={uploadedVideo.videoFile.url}
                controls
                className="published-video-preview"
              />
              <div className="published-details">
                <h4>{uploadedVideo.title}</h4>
                <p>{uploadedVideo.description}</p>
                <button className="view-button">
                  View on Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;