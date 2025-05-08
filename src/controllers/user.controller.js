import { asyncHandler } from "../utils/asycHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get all the parameteres from the  req body
  // validations of parameters
  //check if user already exists
  // check if avater is not null and send it to the cloudinary
  // do same for cover image and send to the cloudinary
  //create user object and send to db
  // check if user is successfully created
  // then remove passwowrd and refreshtoken from the object
  // send the response to user

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log("user existed: ", existedUser);

  if (existedUser) {
    throw new ApiError(409, "user already exist with this username or email");
  }

  const localAvater = req.files?.avatar[0]?.path;

  // console.log("avatar upload cloudinary: ", localAvater);

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!localAvater) {
    throw new ApiError(400, "cover image is required");
  }

  const avatar = await uploadOnCloudinary(localAvater);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("avatar upload cloudinary: ", avatar);
  // console.log("cover image upload cloudinary: ", coverImage);

  if (!avatar) {
    throw new ApiError(400, "cover image is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // console.log("user object ", user);

  // const createdUser = user.findById(user._id).select("-password -refreshToken");
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user internal server error");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
  // res.status(200).json({ message: "User registered" });
});

export { registerUser };
