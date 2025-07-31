import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
content:{
  type:String,
  required:true
},
video:{
  type:Schema.Types.ObjectId,
  ref:"Video"
},
  owner:{
  type:Schema.Types.ObjectId,
  ref:"Users"
  }

},{timestamps:true}
);

videoSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment", commentSchema);