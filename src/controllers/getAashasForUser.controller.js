import User from "../models/user.models.js";
import Aasha from "../models/aasha.model.js";

export const getAashasForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("pincode");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const aashas = await Aasha.find({
  
      pincode: user.pincode,
    }).select("-__v");

    if (!aashas || aashas.length === 0) {
      return res
        .status(404)
        .json({ message: "No Aasha workers found in your area" });
    }

    res.json({
      success: true,
      count: aashas.length,
      aashas,
    });
  } catch (error) {
    console.error("Error fetching Aashas for user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
