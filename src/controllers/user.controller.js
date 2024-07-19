import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    // res.status(200).json({
    //     message: "Hare Krishna" 
    // })

    // user will enter the details on the website
    // we will handle the different details details with diff logic. files and username will have diff logic
    // password will be stored using encyption
    // If user successfully registeed then we will redirect him to the home page
    // If there will any error while registering of the user them we wiil redirect him to the register page once again
    // In both the above cases we will take the help of routes
    // we will use middleware just before saving the info at the cloudinary

    // get user details from frontend
    // check validation - not empty
    // check whether user is already registerd or not
    // check for images, check avatar
    // upload them to cloudinary, avatar
    // create user object - create db entry
    // remove password and refresh token from the response
    // check for user creation
    // return response 

    const {fullName, email, username, password} = req.body()
    console.log("email : ", email);

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError (400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: ({ username }, { email })
    })

    if(existedUser) {
        throw new ApiError (409, "User with same username or same email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0].path; 

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        username : username.toLowerCase(), 
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user ")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}
