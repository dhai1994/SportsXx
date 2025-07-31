import express from "express"
import {Video} from "../models/video.model.js";

import { upload } from "../middleware/multer.middleware.js"
import {publishAVideo,getVideoById,updateVideo,deleteVideo,getAllVideos} from "../controllers/video.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router()
router.get("/search", async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, "i");

  try {
    const videos = await Video.find({
      $or: [
        { title: regex },
        { description: regex },
        { uploaderName: regex },
      ],
    });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err });
  }
})
 

router.route("/home-page").get(getAllVideos) 
router.route("/upload")
.post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/videoId")
    .get(verifyJWT, getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)

    export default router