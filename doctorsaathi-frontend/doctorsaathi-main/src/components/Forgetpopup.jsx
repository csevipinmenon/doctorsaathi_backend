import React, { useState } from "react";
import { X, Mail, Lock, KeyRound, CheckCircle } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://yourapi.com";

const validatePassword = (password) => {
  if (password.length < 8)
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  if (!/[A-Z]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  if (!/[a-z]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  if (!/[0-9]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  return { valid: true };
};

const ForgotPasswordPopup = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Step 1: Send Email + Password
  const handleSendEmail = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const { valid, message: validationMsg } = validatePassword(newPassword);
    if (!valid) {
      setMessage(validationMsg);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/user/forgetPassword`, {
        email,
        password: newPassword,
      });

      if (res.data.success) {
        setMessage("OTP sent successfully to your email. Please verify.");
        setStep(2);
      } else {
        setMessage(res.data.message || "Failed to send OTP");
        
      }
    } catch (err) {
      setMessage("Error sending request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/user/verifyemail`, {
        email,
        otp,
      });

      if (res.data.success) {
        setMessage("Password updated successfully!");
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          {step === 1 ? "Reset Password" : "Verify OTP"}
        </h2>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex items-center border rounded-xl p-3">
              <Mail className="text-indigo-600 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border rounded-xl p-3">
              <Lock className="text-indigo-600 mr-2" />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border rounded-xl p-3">
              <Lock className="text-indigo-600 mr-2" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center border rounded-xl p-3">
              <KeyRound className="text-indigo-600 mr-2" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message.includes("success") ? (
              <div className="flex justify-center items-center gap-2">
                <CheckCircle size={16} /> {message}
              </div>
            ) : (
              message
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
