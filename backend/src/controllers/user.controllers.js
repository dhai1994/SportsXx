import { asyncHandler } from "../Utils/asynchandler.js"
import { ApiError } from "../Utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../Utils/cloudinary.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import jwt from "jsonwebtoken"

//  Generate Access & Refresh Tokens
const generateAccessRefreshTokens = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, "User not found")

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }
};

//  Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body

  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverImageLocalPath = req.files?.CoverImage?.[0]?.path


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }


//console.log("Uploading to Cloudinary:");
//console.log("Avatar path:", avatarLocalPath);
//console.log("Cover image path:", coverImageLocalPath);


  const avatar = await uploadCloudinary(avatarLocalPath)
  const coverImage = coverImageLocalPath
    ? await uploadCloudinary(coverImageLocalPath)
    : null
   //console.log("Cloudinary avatar upload result:", avatar);
   //console.log("Cloudinary cover upload result:", coverImage);


  const newUser = await User.create({
    fullname,
    avatar: avatar?.secure_url || "",     
    coverImage: coverImage?.secure_url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  )
})

//  Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id)

  //console.log(" Generated Access Token:", accessToken);
//console.log(" Generated Refresh Token:", refreshToken);


  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const isProduction = process.env.NODE_ENV === "production";
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: false,      //  must be false in dev on localhost
  sameSite: "Lax",    //  Lax is safest for localhost
  maxAge: 24 * 60 * 60 * 1000
});

const options = {
  httpOnly: true,
  secure: isProduction, 
  sameSite: isProduction ? "None" : "Lax", 
  maxAge: 24 * 60 * 60 * 1000,// 1 day expiry

};
console.log(" Setting accessToken cookie with options:", options);








  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
      }, "User logged in successfully")
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined }
  }, { new: true })

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized - Refresh token missing")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token")
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessRefreshTokens(user._id)

    const options = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, {
          accessToken,
          refreshToken: newRefreshToken
        }, "Access token refreshed")
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
   
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(req.user?._id)
  if (!user) throw new ApiError(404, "User not found");
console.log("Request body:", req.body);  
console.log("Request received");
  console.log("req.user:", req.user); // <--- Important
  console.log("req.body:", req.body)

if (!oldPassword || !newPassword) {
  throw new ApiError(400, "Both fields are required");
}

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// Get Current User
/*const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken")
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"))
})*/
 const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "User fetched successfully")
  )})


// Update Account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body

  if (!(fullname || email)) {
    throw new ApiError(400, "All fields required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname, email }
    },
    { new: true }
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

// Get User Channel Profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        channelSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User channel fetched successfully"));
})


const getWatchHistory =asyncHandler(async(req,res) =>{
  const user =await User.aggregate([
    {
      $lookup:{
        from:"video",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
        localField:"owner",
        foreignField:"_id",
        as:"owner",
        pipeline:[
          {
            $project:{
              fullname:1,
              username:1,
              avatar:1,
            }
          }
        ]

            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory , "WATCH HISTORY FETCHED SUCCESSFULLY"));
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserChannelProfile,
  getWatchHistory 
};
