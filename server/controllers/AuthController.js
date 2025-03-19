import { compare } from "bcrypt";
import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
// JWT token
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
// signup Export
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};
// login export
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.findOne({ email });
    if (!email) {
      return response.status(404).send("User with the given email not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(404).send("Password is incorrect.");
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetUp: user.profileSetUp,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};
//  userinfo export

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User with the given id not found.");
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetUp: userData.profileSetUp,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};

// Update profile controller
export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName) {
      return response
        .status(400)
        .send("Firstname, Lastname and color is required.");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetUp: true },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetUp: userData.profileSetUp,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};

// Add profile Image controller
export const addProfileImage = async (request, response, next) => {
  try {
    const date = Date.now();
    let flieName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, flieName);
    const upadtedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: flieName },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      image: upadtedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};

// Delete profile Image controller
export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).send("User not found.");
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return response.status(200).send("Profile removed successfully.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};
//Logout
export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successfully.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server Error");
  }
};
