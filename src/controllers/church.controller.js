import Church from "../database/models/church.js";
import generateQRCode from "../utils/generateQRCode.js";
import User from "../database/models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const addChurch = async (req, res) => {
  try {
    const {
      userId,
      name,
      churchEmail,
      churchTel,
      churchLocation,
      churchAbout,
      iban,
      sloganMessage,
      charityActions,
      logo,
    } = req.body;

    if (!userId || !name || !iban) {
      return res.status(400).json({
        success: false,
        error: "UserId, Name, and IBAN are required fields.",
      });
    }

    const userExist = await User.findOne({ _id: userId });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        error: "User does not exist",
      });
    }

    if (userExist.role === "normal") {
      return res.status(401).json({
        success: false,
        error: "Privilege goes to admin or manager",
      });
    }

    // Create a new church instance
    const newChurch = new Church({
      userId,
      name,
      churchEmail,
      churchTel,
      churchLocation,
      churchAbout,
      iban,
      sloganMessage,
      charityActions,
    });

    // Check if a logo was provided
    if (logo) {
      // Upload the logo to Cloudinary
      const result = await cloudinaryV2.uploader.upload(logo, {
        folder: "church-logos", // Specify the folder in Cloudinary
      });
      newChurch.logo = result.secure_url;
    }

    const savedChurch = await newChurch.save();
    const churchWebsiteLink = `${process.env.FRONTEND_URL}/church/${savedChurch._id}`;
    const qrCodeData = await generateQRCode(savedChurch._id, churchWebsiteLink);
    savedChurch.qrCodeData = qrCodeData.dataURI;
    savedChurch.churchWebsiteLink = churchWebsiteLink;
    await savedChurch.save();
    return res.status(201).json({
      success: true,
      church: savedChurch,
      churchWebsiteLink,
      qrCode: qrCodeData.dataURI,
    });
  } catch (error) {
    console.error("Error creating or saving church:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getAllChurches = async (req, res) => {
  try {
    const churches = await Church.find().populate({
      path: "userId",
      select: "name",
    });
    const populatedChurches = churches.map((church) => ({
      _id: church._id,
      name: church.name,
      userId: church.userId._id,
      sloganMessage: church.sloganMessage,
      charityActions: church.charityActions,
      iban: church.iban,
      Manager: church.userId ? church.userId.name : null,
      logo: church.logo ? church.logo : "No Logo",
      churchEmail: church.churchEmail,
      churchTel: church.churchTel,
      churchLocation: church.churchLocation,
      churchAbout: church.churchAbout,
    }));
    return res.status(200).json({
      success: true,
      churches: populatedChurches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getChurchById = async (req, res) => {
  try {
    const { churchId } = req.params;
    const church = await Church.findById(churchId);
    if (!church) {
      return res.status(404).json({
        success: false,
        error: "Church not found",
      });
    }
    const user = await User.findById(church.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found for this church",
      });
    }
    return res.status(200).json({
      success: true,
      church: {
        ...church.toObject(),
        user: user.toObject(),
      },
    });
  } catch (error) {
    console.error("Error Fetching church:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const updateChurch = async (req, res) => {
  try {
    const { churchId } = req.params;
    const {
      name,
      churchEmail,
      churchTel,
      churchLocation,
      churchAbout,
      iban,
      sloganMessage,
      charityActions,
      logo,
    } = req.body;

    const church = await Church.findById(churchId);

    if (!church) {
      return res.status(404).json({
        success: false,
        error: "Church not found",
      });
    }

    church.name = name || church.name;
    church.churchEmail = churchEmail || church.churchEmail;
    church.churchTel = churchTel || church.churchTel;
    church.churchLocation = churchLocation || church.churchLocation;
    church.churchAbout = churchAbout || church.churchAbout;
    church.iban = iban || church.iban;
    church.sloganMessage = sloganMessage || church.sloganMessage;
    church.charityActions = charityActions || church.charityActions;

    if (logo) {

      const result = await cloudinaryV2.uploader.upload(logo, {
        folder: "church-logos",
      });
      church.logo = result.secure_url;
    }

    // Save the updated church
    const updatedChurch = await church.save();

    // Update QR code and church website link
    const churchWebsiteLink = `${process.env.FRONTEND_URL}/church/${updatedChurch._id}`;
    const qrCodeData = await generateQRCode(updatedChurch._id, churchWebsiteLink);
    updatedChurch.qrCodeData = qrCodeData.dataURI;
    updatedChurch.churchWebsiteLink = churchWebsiteLink;

    // Save the updated church again with QR code data and website link
    await updatedChurch.save();

    return res.status(200).json({
      success: true,
      church: updatedChurch,
      churchWebsiteLink,
      qrCode: qrCodeData.dataURI,
    });
  } catch (error) {
    console.error("Error updating church:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const deleteChurch = async (req, res) => {
  try {
    const { churchId } = req.params;
    const church = await Church.findById(churchId);
    if (!church) {
      return res.status(404).json({
        success: false,
        error: "Church not found",
      });
    }
    await church.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Church deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting church", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server error",
    });
  }
};

export const getChurchesByManager = async (req, res) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    const manager = await User.findOne({ _id: userId });
    if (!manager) {
      return res.status(404).json({
        success: false,
        error: "Manager not found",
      });
    }
    if (manager.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }
    const churches = await Church.find({ userId });
    return res.status(200).json({
      success: true,
      churches,
    });
  } catch (error) {
    console.error("Error Manager getting churches", error);
    res.status(500).json({
      error: "Internal Server error",
    });
  }
};
