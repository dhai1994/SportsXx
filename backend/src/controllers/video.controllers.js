import mongoose,{isValidObjectId} from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asynchandler.js";
import { uploadCloudinary } from "../Utils/cloudinary.js";
import { User } from "../models/user.model.js";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { upload } from "../middleware/multer.middleware.js";




const publishAVideo = asyncHandler(async(req,res) =>{

const {title, description} =req.body
  //get video from user
  //upload to cloudinary
  //get the url
  // post the video 

  
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

  if(!videoLocalPath){
    throw new ApiError(400,"Videofile is required")
  }
  if(!thumbnailLocalPath){
    throw new ApiError(400,"Thumbnail is required")
  }
  // for upload on cloudinary code already written in cloudinary.js
  //just import that file
  
  
const video = await uploadCloudinary(videoLocalPath)
const thumbnail = await uploadCloudinary(thumbnailLocalPath)

if(!video){
  throw new ApiError(400,"Video file is required")
}
if(!thumbnail){
  throw new ApiError(400,"Thumbnail file is required")
}

//for giving the url to database 

const newVideo= await Video.create({
  title,
  description,
  duration: video.duration,
        videoFile:{
            url: video.url,
            public_id: video
            
            .public_id
        },
        thumbnail:{
            url: thumbnail.url,
            public_id: thumbnail.public_id
        },
        owner: req.user?._id,
        isPublished: false

});
const userId = req.user?._id;


//checking if the video exist in database
const videoUploaded =await Video.findById(newVideo._id)

if(!videoUploaded){
  throw new ApiError(500,"somethin went wrong while uploading the video")
}
//to get response
return res
.status(201)
.json(new ApiResponse(200,videoUploaded,"video Uploaded successfully"))

})


const getVideoById = asyncHandler(async (req,res) =>{
    const { videoId } = req.params
    //TODO: get video by id

     const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
//pipeline for getting owner deatil from user model
const owner =await Video.aggregate([
{
  $match: {
    _id: new mongoose.Types.ObjectId(videoId)
  }
},
{ $lookup:{

from: "likes"  ,
localField: "_id" ,
foreignField:"video",
as:"likes"
  }

},
{
$lookup:{
from: "comments"  ,
localField: "_id" ,
foreignField:"video",
as:"comments"
  }
},
{
  $lookup:{
  from: "users"  ,
  localField: "owner" ,
  foreignField:"_id",
  as:"owner",
  pipeline:[
{
  $lookup:{
  from: "Subscription"  ,
  localField: "_id" ,
  foreignField:"channel",
  as:"subscribers"
        }
},
{
  $addFields: {
        subscribersCount: {
                $size: "$subscribers"
              },
                isSubscribed: {
                      $cond: {
                        if: {
                           $in: [
                              req.user?._id,
                               "$subscribers.subscriber"
                            ]
                        },
              then: true,
              else: false
          }
        }
     }
},
{
$project: {
  username: 1,
  "avatar.url": 1,
  subscribersCount: 1,
  isSubscribed: 1
    }
  }
]
}
},
{
  $addFields:{
      likesCount:{
        $size:"$likes"
      },
      
      owner:{
        $first: "$owner"
      },
      isLiked:{
        $cond: {
          if: {$in: [req.user?._id, "$likes.likedBy"]},
            then: true,
            else: false
      }
      }
    }
},
{
  $project:{
    "videoFile.url":1,
    likesCount:1,
    duration:1,
    views:1,
    comment:1,
    owner:1,
    title:1,
    isLiked:1,
    description:1,
    createdAt:1

    }
  }
])

if (!video) {
return res
.status(500)
.json(new ApiError(500, null, "failed to fetch video"))
}

// increment views if video fetched successfully
await Video.findByIdAndUpdate(videoId, {
$inc:{
  views: 1
}
});

// add this video to user watch history
await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
        watchHistory: videoId
  }
});

//to get response
return res
.status(201)
.json(new ApiResponse(200,videoUploaded,"video with all deatils are  successfully fetched"))

})

const updateVideo = asyncHandler(async (req,res) =>{
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const { description,title } = req.body
    
// to search for the video by id
//check the owner of video 
// deleting the previous thing
//uploading new 
//checking for the updated data

const video =await Video.findById(videoId)

if(!video){
  throw new ApiError(404,"Video not found")
}

if (video?.owner.toString() !== req.user?._id.toString()){
  throw new ApiError(400,"you cann't edit the details of this video as you are not the owner of this video ")
}
 
//for deleting the data
const deleteDesciption = video.description.public_id
const deleteThumbnail = video.thumbnail.public_id 
//for getting local file path
const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
const descriptionLocalPath = req.files?.description[0]?.path;
//for uploading new data in cloudinary
const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
//const description = await uploadOnCloudinary(thumbnailLocalPath);

if(!thumbnail)
{
  throw new ApiError(400,"thumbanil not uploaded on cloudinary")
}

//storing in database
 const updatedVideo = await Video.findByIdAndUpdate(videoId,{

$set: {
title,
description,
thumbnail:{
      public_id: thumbnail.public_id,
      url: thumbnail.url
  }
}
},{new:true}
)

if(!updatedVideo){
  throw new ApiError(500," failed to update video ")
}

//delete local file after upload
fs.unlinkSync(thumbnailLocalPath)

//delete old thumbnail from Cloudinary
if (deleteThumbnail){
await cloudinary.uploader.destroy(deleteThumbnail)
}

return res
.status(200)
.json(new ApiResponse(200, updatedVideo, " Video updated successfully"))
    
})

const deleteVideo = asyncHandler(async(req,res) =>{
const {videoId} = req.params
// check the video is uploaded in data or not 
//check the owner of the video
//delete the video from database
const video = await Video.findById(videoId)
if(!videoId){
  throw new ApiError(401,"Video not found ")
}

if(video?.owner.toString() !== req.user?._id.toString()){
  throw new ApiError(400,"you cann't delete this video as you are not the owner ")
}

//delete video from database(mongodb)
await Video.findByIdAndDelete(video?._id)

//delete video from cloudinary
const videoDeleted = await cloudinary.uploader.destroy(public_id)

if(videoDeleted){
  throw new ApiResponse(200,"Video deleted successfully")
}

// delete video likes
await Like.deleteMany({
video: videoId
})

// delete video comments
await Comment.deleteMany({
video: videoId,
})
    
return res
.status(200)
.json(new ApiResponse(200, {}, "Video deleted successfully"))


})




const getAllVideos = asyncHandler(async(req,res) =>{
 const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  console.log("req.query: ", req.query);
  console.log("userId: ", userId);

  //had to make a search box to search videos (using MONGODB ATLAS)
  //Pagination will be used
  //get video display on the page with limit =10
  //user should be login and verified
  //search on basis of tag,description,filename, (afterwards i will add date,title,category)
  //sort will be there for uploaded first and last
  //filter will be on the basis of -- language,dates etc

const pipeline=[]


/*const matchStage = { isPublished: true }

if (req.query.language) {
  matchStage.language = req.query.language
}

if (req.query.category) {
  matchStage.category = req.query.category
}

pipeline.push({ $match: matchStage })*/


  pipeline.push(
   {
      $lookup:{
        from:"users",
        localField:"owner",
        foreignField:"_id",//videoId
        as:"ownerDetails"

      }
    },
    { $unwind: "$owner" }, //single owner object converted 

    //forsubscribers
    {
      $lookup:{
        from:"subscriptions",
        localField:"owner._id", //userid
        foreignField:"channel",
        as:"subscribers"

      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"owner._id",
        foreignField:"subsribers",
        as:"subscribedTo"

      }
    },
    {
      $addFields:{
        subscribersCount: { 
          $size: "$subscriberTo"
         },
        isSubscribed: {
          $cond:{
            if:{
              $in: [userId, "$subscribers.subscriber"]
            },
            then:true,
            else:false
          }

          
        }
      }
    },
    {
      $project:{
        fullname:1,
        username:1,
        owner:
          {
          _id: "$owner._id",
          username: "$owner.username",
          avatar: "$owner.avatar.url"
          },
        isSubscribed: 1,
        subscribersCount: 1,
        description: 1,
        duration: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
      }
    })
  
//search index
 if (query) {
        pipeline.push({
            $search: {
                index: "search-videos",
                text: {
                    query: query,
                    path: ["title", "description"] // Search only in title and description
                }
            }
        });
    }
//Match videos with the specified owner (if userId is provided)
if (userId) {
    if (!isValidObjectId(userId)) {
      return res
      .status(400)
      .json(new ApiError(400, null, "Invalid userId"));
}
pipeline.push({
  $match: {
    owner: new mongoose.Types.ObjectId(userId)
        }
    });
}

//Filter only published videos
pipeline.push(
  { 
    $match: {
      isPublished: true 
    } 
});

//Sorting
if (sortBy && sortType) {
    pipeline.push(
      {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1
      }
});
  } else {
        pipeline.push(
          {
             $sort: { createdAt: -1 } 
});
}

//Add pagination
const skip = (page - 1) * limit;
pipeline.push(
  { $skip: skip },
  { $limit: parseInt(limit, 10) }
);
     
/*if (!videoDetails.length) {
  throw new ApiError(404, "Video not found");
}  */  

const videos = await Video.aggregate(pipeline) //allquery,userid and sorting all given to pipeline


return res.status(200).json(
    new ApiResponse(200, videos, "Video details fetched successfully")
  )

 
})


export {
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideos
}