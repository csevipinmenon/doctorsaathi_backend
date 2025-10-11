import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

// console.log(process.env.STRIPE_SECRET_KEY);
// console.log("base url",process.env.FRONTEND_URL);




export const payment = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, message, amount } = req.body;

    
    if (!fullName || !email || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, and valid amount are required",
      });
    }

    
    const product = await stripe.products.create({
      name: "DoctorSaathi Payment",
      description: `Payment by ${fullName}. Message: ${message || "N/A"}`,
    });

  
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount * 100, 
      currency: "inr",
    });

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "payment",
      success_url: `${baseUrl}/paymnet/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      customer_email: email,
      metadata: {
        fullName,
        message: message || "No message provided",
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
      message: "Stripe payment session created successfully",
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});
