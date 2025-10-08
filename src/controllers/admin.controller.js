import User from "../models/user.models.js";
import ExcelJS from "exceljs";
import Doctor from "../models/doctor.models.js";
import Aasha from "../models/aasha.model.js";
import { Consult } from "../models/consult.model.js";

export const adminProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({ user });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const exportAllusers = async (req, res) => {
  try {
    const users = await User.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "_id", width: 35 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 30 },
      { header: "Aadhar", key: "Aadhar", width: 30 },
      { header: "gender", key: "gender", width: 30 },
      { header: "Pincode", key: "pincode", width: 30 },
      { header: "Age", key: "age", width: 30 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    users.forEach((user) => {
      worksheet.addRow(user.toObject());
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const users = await Doctor.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const exportAlldoctors = async (req, res) => {
  try {
    const users = await User.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "_id", width: 35 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 30 },
      { header: "Hospital", key: "hospital", width: 30 },
      { header: "Specialist", key: "specialist", width: 30 },
      { header: "Experience", key: "experience", width: 30 },
      { header: "gender", key: "gender", width: 30 },
      { header: "Pincode", key: "pincode", width: 30 },
      { header: "Age", key: "age", width: 30 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    users.forEach((user) => {
      worksheet.addRow(user.toObject());
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllAasha = async (req, res) => {
  try {
    const users = await Aasha.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const exportAllAasha = async (req, res) => {
  try {
    const users = await Aasha.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "_id", width: 35 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 30 },
      { header: "Aadhar", key: "Aadhar", width: 30 },
      { header: "gender", key: "gender", width: 30 },
      { header: "Pincode", key: "pincode", width: 30 },
      { header: "Age", key: "age", width: 30 },
      { header: "location", key: "location", width: 30 },

      { header: "Created At", key: "createdAt", width: 25 },
    ];

    users.forEach((user) => {
      worksheet.addRow(user.toObject());
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// remove

export const removeAashaByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedAasha = await Aasha.findOneAndDelete({ email });

    if (!deletedAasha) {
      return res.status(404).json({ message: "Aasha not found" });
    }

    res.status(200).json({
      success: true,
      message: `Aasha with email ${email} has been removed successfully`,
      data: deletedAasha,
    });
  } catch (error) {
    console.error("Error removing Aasha:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User with email ${email} has been removed successfully`,
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error removing User:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeDoctorByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedDoctor = await Doctor.findOneAndDelete({ email });

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: `Doctor with email ${email} has been removed successfully`,
      data: deletedDoctor,
    });
  } catch (error) {
    console.error("Error removing Doctor:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Admin: Add a new Aasha
export const addAasha = async (req, res) => {
  try {
    const { name, email, phone, gender, location, Aadhar, age, pincode } = req.body;

  
    if (!name || !email || !phone || !gender || !location || !Aadhar || !age || !pincode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    
    const existingAasha = await Aasha.findOne({ email });
    if (existingAasha) {
      return res.status(400).json({ success: false, message: "Aasha with this email already exists" });
    }

    
    const newAasha = new Aasha({
      name,
      email,
      phone,
      gender,
      location,
      Aadhar,
      age,
      pincode,
      role: "aasha", 
    });

    await newAasha.save();

    res.status(201).json({
      success: true,
      message: "Aasha added successfully",
      data: newAasha,
    });
  } catch (error) {
    console.error("Error adding Aasha:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getallConsults = async (req, res) => {
  try {
    const consults = await Consult.find().sort({
      createdAt: -1,
    });

    if (!consults || consults.length === 0) {
      return res
        .status(201)
        .json({ message: "No consultations found" });
    }

    res.status(200).json({
      success: true,
      count: consults.length,
      consultations: consults,
    });
  } catch (error) {
    console.error("Error fetching all consultations:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch all consultations.",
    });
  }
};