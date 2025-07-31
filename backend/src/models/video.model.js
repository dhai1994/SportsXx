import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: Number,
  videoFile: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  thumbnail: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

  


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)