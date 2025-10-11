// Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Stethoscope,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Phone,
  MapPin,
  ClipboardList,
  Calendar,
  Loader,
} from "lucide-react";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";
import ForgotPasswordPopup from "../components/Forgetpopup";

// --- API BASE URL ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- VALIDATION FUNCTIONS ---
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, must contain uppercase, lowercase, number, and special char
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
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  return { valid: true };
};

const validateIndianMobile = (mobile) => {
  // Indian mobile: 10 digits, starts with 6-9
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

const validatePincode = (pincode) => {
  // Indian pincode: exactly 6 digits
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

const validateAadhar = (aadhar) => {
  // Aadhar: exactly 12 digits
  if (!aadhar) return true; // Optional field
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

const validateAge = (age) => {
  const ageNum = parseInt(age);
  return ageNum > 0 && ageNum < 150;
};

// --- AUTH HELPERS ---
const setAuthToken = (key, token) => {
  localStorage.setItem(key, token);
  window.dispatchEvent(new Event("authChange"));
};

// --- Form Input Component ---
const FormInput = ({
  id,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  optional = false,
  value,
  onChange,
  required = false,
  error = "",
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}{" "}
      {optional && (
        <span className="text-xs text-gray-400 font-normal">(Optional)</span>
      )}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon
            className={`w-5 h-5 ${error ? "text-red-400" : "text-gray-400"}`}
          />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        className={`block w-full rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } sm:text-sm p-3 transition duration-150 ${Icon ? "pl-10" : "pl-3"}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- User Register Form ---
const UserRegisterForm = ({ formData, handleChange, notify }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (!validateAge(formData.age)) {
      newErrors.age = "Please enter a valid age (1-149)";
    }

    // Mobile validation
    if (!formData.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!validateIndianMobile(formData.phone)) {
      newErrors.phone =
        "Enter valid Indian mobile (10 digits, starts with 6-9)";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Pincode validation
    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit Indian pincode";
    }

    // Aadhar validation (optional)
    if (formData.Aadhar && !validateAadhar(formData.Aadhar)) {
      newErrors.Aadhar = "Enter valid 12-digit Aadhar number";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.valid) {
        newErrors.password = passwordCheck.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify("Please fix all validation errors", "error");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/user/signup`, {
        name: formData.fullName,
        gender: formData.gender,
        age: formData.age,
        phone: formData.phone,
        location: formData.location,
        pincode: formData.pincode,
        Aadhar: formData.Aadhar,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
      notify("Registration successful! Please login.", "success");

      // Clear form after successful registration
      handleChange({ target: { name: "fullName", value: "" } });
      handleChange({ target: { name: "gender", value: "" } });
      handleChange({ target: { name: "age", value: "" } });
      handleChange({ target: { name: "phone", value: "" } });
      handleChange({ target: { name: "location", value: "" } });
      handleChange({ target: { name: "pincode", value: "" } });
      handleChange({ target: { name: "Aadhar", value: "" } });
      handleChange({ target: { name: "email", value: "" } });
      handleChange({ target: { name: "password", value: "" } });
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. Please check your details.";
      notify(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8">
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
        <FormInput
          id="fullName"
          label="Full Name"
          icon={User}
          placeholder="Jane Doe"
          required={true}
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            className={`block w-full rounded-lg border ${
              errors.gender ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 transition duration-150`}
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
          )}
        </div>
        <FormInput
          id="age"
          label="Age"
          type="number"
          icon={Calendar}
          placeholder="30"
          required={true}
          value={formData.age}
          onChange={handleChange}
          error={errors.age}
        />
        <FormInput
          id="phone"
          label="Mobile"
          type="tel"
          icon={Phone}
          placeholder="9876543210"
          required={true}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <FormInput
          id="location"
          label="Location"
          icon={MapPin}
          placeholder="Street, City"
          required={true}
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
        />
        <FormInput
          id="pincode"
          label="Pincode"
          type="text"
          placeholder="123456"
          required={true}
          value={formData.pincode}
          onChange={handleChange}
          error={errors.pincode}
        />
        <FormInput
          id="Aadhar"
          label="Aadhar No"
          type="text"
          icon={ClipboardList}
          optional
          placeholder="123456789012"
          value={formData.Aadhar}
          onChange={handleChange}
          error={errors.Aadhar}
        />
        <div className="md:col-span-2">
          <FormInput
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            placeholder="name@example.com"
            required={true}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        <div className="md:col-span-2">
          <FormInput
            id="password"
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Min 8 chars, 1 upper, 1 lower, 1 number, 1 special"
            required={true}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3 px-4 flex items-center justify-center space-x-2 text-white font-semibold rounded-lg shadow-md transition duration-200 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
        <span>{isLoading ? "Registering..." : "Register"}</span>
      </button>
    </form>
  );
};

// --- User Login Form ---
const UserLoginForm = ({ formData, handleChange, notify }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loginEmail) {
      newErrors.loginEmail = "Email is required";
    } else if (!validateEmail(formData.loginEmail)) {
      newErrors.loginEmail = "Enter a valid email address";
    }

    if (!formData.loginPassword) {
      newErrors.loginPassword = "Password is required";
    } else if (formData.loginPassword.length < 8) {
      newErrors.loginPassword = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify("Please fix all validation errors", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/user/login`, {
        email: formData.loginEmail.toLowerCase().trim(),
        password: formData.loginPassword,
      });

      if (res.data?.token) {
        setAuthToken("userAuthToken", res.data.token);
        notify("Login successful! Redirecting...", "success");

        // Clear login form
        handleChange({ target: { name: "loginEmail", value: "" } });
        handleChange({ target: { name: "loginPassword", value: "" } });
        setErrors({});

        // Wait for notification to show, then redirect
        setTimeout(() => {
          navigate("/user", { replace: true });
        }, 1000);
      } else {
        notify("Unexpected response. Please try again.", "error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      notify(msg, "error");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8">
      <FormInput
        id="loginEmail"
        label="Email"
        required={true}
        type="email"
        icon={Mail}
        placeholder="name@example.com"
        value={formData.loginEmail}
        onChange={handleChange}
        error={errors.loginEmail}
      />
      <FormInput
        id="loginPassword"
        label="Password"
        required={true}
        type="password"
        icon={Lock}
        placeholder="********"
        value={formData.loginPassword}
        onChange={handleChange}
        error={errors.loginPassword}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3 px-4 flex items-center justify-center space-x-2 text-white font-semibold rounded-lg shadow-md transition duration-200 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        <span>{isLoading ? "Logging in..." : "Login"}</span>
      </button>
      <div className="mt-4 text-center">
        <p
          onClick={() => setShowForgotPopup(true)}
          className="text-indigo-600 cursor-pointer hover:underline mt-3 text-sm"
        >
          Forgot Password?
        </p>

        {showForgotPopup && (
          <ForgotPasswordPopup onClose={() => setShowForgotPopup(false)} />
        )}
      </div>
    </form>
  );
};

// --- Doctor Login Form ---
const DoctorLoginForm = ({ formData, handleChange, notify }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorEmail) {
      newErrors.doctorEmail = "Email is required";
    } else if (!validateEmail(formData.doctorEmail)) {
      newErrors.doctorEmail = "Enter a valid email address";
    }

    if (!formData.doctorPassword) {
      newErrors.doctorPassword = "Password is required";
    } else if (formData.doctorPassword.length < 8) {
      newErrors.doctorPassword = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notify("Please fix all validation errors", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/doctor/login`, {
        email: formData.doctorEmail.trim(),
        password: formData.doctorPassword,
      });

      if (res.data?.token) {
        setAuthToken("doctorAuthToken", res.data.token);
        notify("Doctor login successful! Redirecting...", "success");

        // Clear form
        handleChange({ target: { name: "doctorEmail", value: "" } });
        handleChange({ target: { name: "doctorPassword", value: "" } });
        setErrors({});

        setTimeout(() => {
          navigate("/doctor", { replace: true });
        }, 1000);
      } else {
        notify("Unexpected response. Please try again.", "error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Doctor login error:", err);
      const msg =
        err.response?.data?.message ||
        "Doctor login failed. Please check credentials.";
      notify(msg, "error");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8">
      <FormInput
        id="doctorEmail"
        label="Email"
        type="email"
        required={true}
        icon={Mail}
        placeholder="doctor@example.com"
        value={formData.doctorEmail}
        onChange={handleChange}
        error={errors.doctorEmail}
      />
      <FormInput
        id="doctorPassword"
        label="Password"
        type="password"
        required={true}
        icon={Lock}
        placeholder="********"
        value={formData.doctorPassword}
        onChange={handleChange}
        error={errors.doctorPassword}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3 px-4 flex items-center justify-center space-x-2 text-white font-semibold rounded-lg shadow-md transition duration-200 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        <span>{isLoading ? "Logging in..." : "Login"}</span>
      </button>
    </form>
  );
};

// --- Main Login Component ---
const Login = () => {
  const [activeRole, setActiveRole] = useState("user");
  const [activeUserMode, setActiveUserMode] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    mobile: "",
    location: "",
    pincode: "",
    Aadhar: "",
    email: "",
    password: "",
    loginEmail: "",
    loginPassword: "",
    doctorEmail: "",
    doctorPassword: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  // Check if already logged in and redirect (only on mount)
  useEffect(() => {
    const isUserLoggedIn = !!localStorage.getItem("userAuthToken");
    const isDoctorLoggedIn = !!localStorage.getItem("doctorAuthToken");

    if (isUserLoggedIn) {
      navigate("/user", { replace: true });
    } else if (isDoctorLoggedIn) {
      navigate("/doctor", { replace: true });
    }
  }, []); // Empty dependency array - only run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notify = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const isUserActive = activeRole === "user";
  const isDoctorActive = activeRole === "doctor";

  const tabClasses =
    "flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2";
  const activeUserTab = `${tabClasses} bg-blue-500 text-white shadow-lg`;
  const inactiveUserTab = `${tabClasses} bg-white text-blue-500 border border-blue-500 hover:bg-blue-50`;
  const activeSubTab = `px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer`;
  const inactiveSubTab = `px-6 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200`;

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome to DoctorSaathi
            </h1>
            <p className="text-gray-600">Login or Register to continue</p>
          </div>

          <div className="flex px-4 md:px-6 space-x-4 mb-8">
            <div
              className={isUserActive ? activeUserTab : inactiveUserTab}
              onClick={() => {
                setActiveRole("user");
                setActiveUserMode("login");
              }}
            >
              <User className="w-5 h-5" />
              <span>User</span>
            </div>
            <div
              className={isDoctorActive ? activeUserTab : inactiveUserTab}
              onClick={() => {
                setActiveRole("doctor");
              }}
            >
              <Stethoscope className="w-5 h-5" />
              <span>Doctor</span>
            </div>
          </div>

          {isUserActive && (
            <>
              <div className="flex justify-center space-x-4 mb-6">
                <div
                  className={
                    activeUserMode === "login"
                      ? `${activeSubTab} bg-blue-500 text-white shadow-md`
                      : inactiveSubTab
                  }
                  onClick={() => setActiveUserMode("login")}
                >
                  Login
                </div>
                <div
                  className={
                    activeUserMode === "register"
                      ? `${activeSubTab} bg-emerald-600 text-white shadow-md`
                      : inactiveSubTab
                  }
                  onClick={() => setActiveUserMode("register")}
                >
                  Register
                </div>
              </div>
              {activeUserMode === "login" ? (
                <UserLoginForm
                  formData={formData}
                  handleChange={handleChange}
                  notify={notify}
                />
              ) : (
                <UserRegisterForm
                  formData={formData}
                  handleChange={handleChange}
                  notify={notify}
                />
              )}
            </>
          )}

          {isDoctorActive && (
            <DoctorLoginForm
              formData={formData}
              handleChange={handleChange}
              notify={notify}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
