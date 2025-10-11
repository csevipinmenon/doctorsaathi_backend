import React, { useState, useEffect } from "react";
import {
  User,
  Stethoscope,
  Phone,
  MessageSquare,
  FileText,
  PhoneCall,
  Download,
  X,
  Menu,
  Loader,
  HeartHandshake,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import Notification from "../components/Notification";
import FloatingContactHub from "../components/ContactHub";
import DoctorSaathiBot from "../components/ChatBot";

// --- API Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = {
  get: async (endpoint, config = {}) => {
    const token = localStorage.getItem("userAuthToken");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...config.headers,
      },
      ...config,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  post: async (endpoint, data, config = {}) => {
    const token = localStorage.getItem("userAuthToken");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...config.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  upload: async (endpoint, formData) => {
    const token = localStorage.getItem("userAuthToken");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};

const apiService = {
  logout: async () => {
    try {
    } finally {
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("user");
    }
  },
  fetchUserProfile: async () => apiClient.get("/user/profile"),
  fetchChats: async () => apiClient.get("/chats"),
  fetchMessages: async (chatId) => apiClient.get(`/chats/${chatId}/messages`),
  sendMessage: async (chatId, messageData) =>
    apiClient.post(`/chats/${chatId}/messages`, {
      text: messageData.text,
      type: messageData.type || "text",
      timestamp: new Date().toISOString(),
    }),
  uploadImage: async (chatId, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("chatId", chatId);
    formData.append("timestamp", new Date().toISOString());
    return apiClient.upload(`/chats/${chatId}/upload-image`, formData);
  },

  fetchPrescriptions: async () => {
    const token = localStorage.getItem("userAuthToken");
    const response = await fetch(`${API_BASE_URL}/user/prescription`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch prescriptions");
    return await response.json();
  },

  submitConsultation: async (consultData, email) =>
    apiClient.post("/user/bookconsult", {
      name: consultData.name,
      age: consultData.age,
      gender: consultData.gender,
      symptoms: consultData.symptoms,
      phone: consultData.mobile,
      specialist: consultData.doctorType,
      email: email,
    }),
  fetchASHAContacts: async () => apiClient.get("/user/aashas"),
};

// --- Add ConsultHistory Component ---
const ConsultHistory = ({ currentUser }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultation history for the current user
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // API: /user/getuser/consult/email=<user email>
        const res = await apiClient.get(
          `/user/getuser/consult/${encodeURIComponent(currentUser.email)}`
        );
        // Expecting res to be an array of consults
        setHistory(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        setError("Failed to load consultation history.");
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.email) fetchHistory();
  }, [currentUser]);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-5xl mx-auto">
        <ErrorDisplay
          message={error}
          onRetry={() => window.location.reload()}
        />
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Stethoscope className="w-6 h-6 text-blue-500" />
        <span>Consultation History</span>
      </h2>
      {history.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No consultation history found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl bg-white shadow">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Patient
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Gender
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Age
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Symptoms
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Specialist
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Chat
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Doctor
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Hospital
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Degree
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Photo
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item._id || idx} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.gender}</td>
                  <td className="px-4 py-2">{item.age}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  <td className="px-4 py-2">{item.symptoms}</td>
                  <td className="px-4 py-2">{item.specialist}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {item.status === "approved" ? (
                      <button
                        onClick={() =>
                          window.open(
                            `/chat/${item.doctor?._id}/${item.userDetails?._id}`,
                            "_blank"
                          )
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs"
                      >
                        Chat
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2">{item.doctor?.name || "-"}</td>
                  <td className="px-4 py-2">{item.doctor?.hospital || "-"}</td>
                  <td className="px-4 py-2">{item.doctor?.degree || "-"}</td>
                  <td className="px-4 py-2">
                    {item.doctor?.photo ? (
                      <img
                        src={item.doctor.photo}
                        alt="Doctor"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

// --- Navigation Items ---
const navItems = [
  { id: "profile", name: "Profile", icon: User },
  { id: "consult", name: "New Consult", icon: Stethoscope },
  { id: "history", name: "Consult History", icon: ClipboardList },
  { id: "prescriptions", name: "My Prescriptions", icon: FileText },
  { id: "help", name: "Help (Call ASHA)", icon: PhoneCall },
];

// --- Utility Components ---

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg transition duration-200 hover:shadow-xl ${className}`}
  >
    {children}
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <p className="text-gray-700 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Try Again
      </button>
    )}
  </div>
);

// --- Form Components ---
const FormInput = ({
  id,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  optional = false,
  value,
  onChange,
  disabled = false,
  required = false,
  pattern,
  title,
  maxLength,
  min,
  max,
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
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        disabled={disabled}
        required={required}
        pattern={pattern}
        title={title}
        maxLength={maxLength}
        min={min}
        max={max}
        className={`block w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 transition duration-150 ${
          Icon ? "pl-10" : "pl-3"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// --- Dashboard Components ---
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchUserProfile();
      setUserData(data.user || data); // Accepts {user: {...}} or {...}
    } catch (error) {
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <ErrorDisplay message={error} onRetry={loadProfile} />
      </Card>
    );
  }

  if (!userData) return null;

  // Only render primitive values, not objects/arrays
  const primitiveEntries = Object.entries(userData).filter(
    ([key, value]) =>
      !["fullName", "name", "email", "id", "_id", "password", "__v"].includes(
        key
      ) &&
      (typeof value !== "object" || value === null)
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <User className="w-6 h-6 text-blue-500" />
        <span>My Health Profile</span>
      </h2>
      <div className="flex flex-col md:flex-row items-start md:space-x-8">
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 w-full">
          <div className="col-span-full">
            <p className="text-lg font-semibold text-blue-600">
              {userData.name}
            </p>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
          {primitiveEntries.map(([key, value]) => (
            <div key={key}>
              <p className="text-xs font-medium uppercase text-gray-500">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {value !== undefined && value !== null && value !== ""
                  ? String(value)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const NewConsult = ({ setNotification, currentUser }) => {
  const [consultData, setConsultData] = useState({
    name: currentUser?.fullName || currentUser?.name || "",
    age: currentUser?.age || "",
    gender: currentUser?.gender || "",
    mobile: currentUser?.mobile || currentUser?.phone || "",
    doctorType: "",
    symptoms: "",
    aadhaar: currentUser?.aadhaarNo || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validate Indian mobile number (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(consultData.mobile)) {
      setNotification({
        message:
          "Please enter a valid 10-digit Indian mobile number starting with 6-9",
        type: "error",
      });
      return false;
    }

    // Validate Aadhaar number if provided (12 digits)
    if (consultData.aadhaar && consultData.aadhaar.trim()) {
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(consultData.aadhaar.replace(/\s/g, ""))) {
        setNotification({
          message: "Please enter a valid 12-digit Aadhaar number",
          type: "error",
        });
        return false;
      }
    }

    // Validate age (reasonable range)
    const age = parseInt(consultData.age);
    if (age < 0 || age > 120) {
      setNotification({
        message: "Please enter a valid age between 0 and 120",
        type: "error",
      });
      return false;
    }

    // Validate name (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(consultData.name)) {
      setNotification({
        message: "Please enter a valid name (letters only)",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.submitConsultation(consultData, currentUser.email);
      setNotification({
        message:
          "Consultation request submitted successfully! You will be notified once a doctor approves.",
        type: "success",
      });
      setConsultData((prev) => ({
        ...prev,
        doctorType: "",
        symptoms: "",
        photo: null,
      }));
    } catch (error) {
      setNotification({
        message:
          error.message || "Failed to submit consultation. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const doctorOptions = [
    "General Physician",
    "Neurologist",
    "Dentist",
    "Cardiologist",
    "Pediatrician",
    "Dermatologist",
    "Gynecologist",
    "Orthopedic",
  ];

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Stethoscope className="w-6 h-6 text-green-500" />
        <span>Book New Consultation</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormInput
            id="name"
            label="Patient Name"
            placeholder="Enter Name"
            required={true}
            value={consultData.name}
            onChange={handleChange}
          />
          <FormInput
            id="age"
            label="Age"
            type="number"
            placeholder="Enter age"
            required={true}
            value={consultData.age}
            onChange={handleChange}
            min="0"
            max="120"
          />

          <div className="mb-4">
            <label
              htmlFor="doctorType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="block w-full rounded-lg border-2 border-gray-300 text-sm p-3 transition duration-150 focus:ring-blue-500 focus:border-blue-500"
              value={consultData.gender}
              onChange={handleChange}
            >
              <option disabled value="">
                -- Select Gender --
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <FormInput
            id="mobile"
            label="Mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            required={true}
            value={consultData.mobile}
            onChange={handleChange}
            pattern="[6-9]\d{9}"
            title="Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
          />
          <div className="mb-4">
            <label
              htmlFor="doctorType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Doctor Type
            </label>
            <select
              id="doctorType"
              name="doctorType"
              required
              className="block w-full rounded-lg border-2 border-gray-300 text-sm p-3 transition duration-150 focus:ring-blue-500 focus:border-blue-500"
              value={consultData.doctorType}
              onChange={handleChange}
            >
              <option disabled value="">
                -- Select Specialist --
              </option>
              {doctorOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <FormInput
            id="aadhaar"
            label="Aadhaar No"
            optional={true}
            placeholder="Enter 12-digit Aadhaar number"
            value={consultData.aadhaar}
            onChange={handleChange}
            pattern="\d{12}"
            maxLength="12"
            title="Please enter a valid 12-digit Aadhaar number"
          />
        </div>
        <div className="mb-4 col-span-full">
          <label
            htmlFor="symptoms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Symptoms (Describe your issue)
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            rows="4"
            required
            className="block w-full rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 transition duration-150"
            value={consultData.symptoms}
            onChange={handleChange}
            placeholder="e.g., Fever for 3 days, mild headache, and sore throat..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 text-white font-semibold rounded-lg shadow-md transition duration-200 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Stethoscope className="w-5 h-5" />
          )}
          <span>
            {isSubmitting ? "Submitting..." : "Submit Consultation Request"}
          </span>
        </button>
      </form>
    </Card>
  );
};

const HelpASHA = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchedContacts = await apiService.fetchASHAContacts();
      // Ensure contacts is always an array
      if (!Array.isArray(fetchedContacts)) {
        // If API returns {data: [...]}, {aashas: [...]}, or {contacts: [...]}
        if (Array.isArray(fetchedContacts.data)) {
          fetchedContacts = fetchedContacts.data;
        } else if (Array.isArray(fetchedContacts.aashas)) {
          fetchedContacts = fetchedContacts.aashas;
        } else if (Array.isArray(fetchedContacts.contacts)) {
          fetchedContacts = fetchedContacts.contacts;
        } else {
          fetchedContacts = [];
        }
      }
      setContacts(fetchedContacts);
    } catch (error) {
      setError("Failed to load ASHA contacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-5xl mx-auto">
        <ErrorDisplay message={error} onRetry={loadContacts} />
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <PhoneCall className="w-6 h-6 text-green-500" />
        <span>Help & ASHA Contact</span>
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Total Contacts: <span className="font-semibold">{contacts.length}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <div
            key={contact.id || index}
            className="border border-gray-200 rounded-xl p-4 transition duration-200 hover:shadow-md"
          >
            <p className="text-lg font-semibold text-blue-700">
              {contact.name}
            </p>
            <p className="text-sm text-green-600 font-medium mb-2">
              {contact.pincode}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="font-mono text-base text-gray-900 mb-2 sm:mb-0">
                {contact.phone}
              </p>
              <a
                href={`tel:${contact.phone?.replace(/\s/g, "")}`}
                className="px-4 py-2 text-sm flex items-center space-x-2 text-white font-semibold rounded-full shadow-md transition duration-200 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center p-10 text-gray-500">
          No ASHA contacts available.
        </div>
      )}
    </Card>
  );
};

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // --- Load Prescriptions ---
  const loadPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchPrescriptions();
      // Handle both { prescriptions: [...] } or direct array
      const prescriptionsList = data.prescriptions || data;
      setPrescriptions(
        Array.isArray(prescriptionsList) ? prescriptionsList : []
      );
    } catch (error) {
      setError("Failed to load prescriptions. Please try again.");
      console.error("Prescription fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  // --- Generate PDF in Frontend ---
  const generatePrescriptionPDF = (prescription) => {
    const prescriptionText =
      prescription.prescription ||
      prescription.medicines ||
      "No details provided";

    // Extract doctor info
    const doctorName =
      typeof prescription.doctor === "object"
        ? prescription.doctor?.name
        : prescription.doctor || prescription.doctorName || "Doctor";
    const doctorEmail =
      typeof prescription.doctor === "object" ? prescription.doctor?.email : "";

    // Extract Dosage and Follow-up
    const dosageMatch = prescriptionText.match(
      /dosage[:\-]?\s*(.+?)(?=$|\n|followUp[:\-]?)/i
    );
    const followUpMatch = prescriptionText.match(
      /followUp[:\-]?\s*(.+?)(?=$|\n)/i
    );

    const dosage =
      prescription.dosage || (dosageMatch ? dosageMatch[1].trim() : "N/A");
    const followUp =
      prescription.followUp ||
      (followUpMatch ? followUpMatch[1].trim() : "N/A");
    const date = new Date(
      prescription.createdAt || prescription.date
    ).toLocaleDateString();

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Prescription - ${doctorName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0 0 10px 0;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
          }
          .section h2 {
            color: #1e40af;
            margin: 0 0 10px 0;
            font-size: 18px;
          }
          .section p {
            margin: 8px 0;
            line-height: 1.6;
            color: #334155;
          }
          .label {
            font-weight: bold;
            color: #1e40af;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Prescription</h1>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          ${doctorEmail ? `<p><strong>Email:</strong> ${doctorEmail}</p>` : ""}
          <p><strong>Date:</strong> ${date}</p>
        </div>

        <div class="section">
          <h2>Prescription Details</h2>
          <p>${prescriptionText}</p>
        </div>

        <div class="section">
          <h2>Dosage Instructions</h2>
          <p>${dosage}</p>
        </div>

        <div class="section">
          <h2>Follow-up</h2>
          <p>${followUp}</p>
        </div>

        <div class="footer">
          <p>This is a computer-generated prescription from DoctorSaathi</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // --- Handle PDF Download ---
  const handleDownload = async (prescriptionId, prescription) => {
    setDownloadingId(prescriptionId);
    try {
      generatePrescriptionPDF(prescription);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate prescription PDF. Please try again.");
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Card className="max-w-5xl mx-auto">
        <ErrorDisplay message={error} onRetry={loadPrescriptions} />
      </Card>
    );
  }

  // --- Main Render ---
  return (
    <Card className="max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <FileText className="w-6 h-6 text-blue-500" />
        <span>My Prescriptions</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prescriptions.map((rx) => {
          const prescriptionText =
            rx.medicines || rx.prescription || "No details provided";

          // --- Extract Dosage and Follow-up from text ---
          const dosageMatch = prescriptionText.match(
            /dosage[:\-]?\s*(.+?)(?=$|\n|followUp[:\-]?)/i
          );
          const followUpMatch = prescriptionText.match(
            /followUp[:\-]?\s*(.+?)(?=$|\n)/i
          );

          const dosage =
            rx.dosage || (dosageMatch ? dosageMatch[1].trim() : "N/A");
          const followUp =
            rx.followUp || (followUpMatch ? followUpMatch[1].trim() : "N/A");

          return (
            <div
              key={rx.id || rx._id}
              className="border border-blue-200 rounded-xl p-5 shadow-sm bg-blue-50 flex flex-col"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-3 border-b pb-2">
                <div>
                  <p className="text-lg font-bold text-blue-700">
                    {typeof rx.doctor === "object"
                      ? rx.doctor?.name
                      : rx.doctor || rx.doctorName || "Doctor"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date:{" "}
                    {new Date(rx.date || rx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="px-3 py-1.5 text-sm flex items-center space-x-1.5 text-white font-semibold rounded-full shadow-md transition duration-200 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                  onClick={() => handleDownload(rx.id || rx._id)}
                  disabled={downloadingId === (rx.id || rx._id)}
                >
                  {downloadingId === (rx.id || rx._id) ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>

              {/* Prescription Details */}
              <div className="space-y-2 flex-grow text-sm">
                <p>
                  <span className="font-semibold">Prescription:</span>{" "}
                  {prescriptionText}
                </p>
                <p>
                  <span className="font-semibold">Dosage:</span> {dosage}
                </p>
                <p>
                  <span className="font-semibold">Follow-up:</span> {followUp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Prescriptions Found */}
      {prescriptions.length === 0 && (
        <div className="text-center p-10 text-gray-500">
          No prescriptions found yet.
        </div>
      )}
    </Card>
  );
};

// --- Navigation Components ---
const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => (
  <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl sticky top-0 h-screen">
    <div className="p-4">
      <div className="flex items-center justify-center p-4 mb-6 bg-blue-50 rounded-lg">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </Link>
      </div>

      <nav className="flex-grow">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ${
              activeSection === item.id
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-semibold">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>

    <div className="p-4 border-t">
      <p className="text-sm font-semibold text-gray-700">
        {user?.fullName || user?.name || "User"}
      </p>
      <p className="text-xs text-gray-500 mb-3">{user?.email || ""}</p>
      <button
        onClick={onLogout}
        className="w-full py-2 px-4 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
      >
        Logout
      </button>
    </div>
  </div>
);

const TopNav = ({ toggleSidebar }) => (
  <div className="md:hidden sticky top-0 z-40 bg-white shadow-lg p-3">
    <div className="flex justify-between items-center">
      <button onClick={toggleSidebar} className="p-2 text-blue-600">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-2">
        <HeartHandshake className="w-8 h-8 text-blue-600" />
        <span className="text-lg font-bold text-blue-700">DoctorSaathi</span>
      </div>
      <div className="w-10"></div>
    </div>
  </div>
);

// --- Main App Component ---
const UserPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch user details on mount (protected route, so user is authenticated)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.fetchUserProfile();
        setCurrentUser(data.user || data);
      } catch {
        setNotification({
          message: "Failed to fetch user details.",
          type: "error",
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } finally {
      setCurrentUser(null);
      setActiveSection("profile");
      setNotification({ message: "Logged out successfully", type: "success" });
      window.location.reload();
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeNotification = () => setNotification({ message: "", type: "" });

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(closeNotification, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfilePage />;
      case "consult":
        return (
          <NewConsult
            setNotification={setNotification}
            currentUser={currentUser}
          />
        );
      case "history":
        return <ConsultHistory currentUser={currentUser} />;
      case "help":
        return <HelpASHA />;
      case "prescriptions":
        return <MyPrescriptions />;
      default:
        return <ProfilePage />;
    }
  };

  const DashboardView = () => (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 font-sans w-full">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={currentUser}
        onLogout={handleLogout}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <div
            className="w-64 bg-white h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <X
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onClick={toggleSidebar}
              />
            </div>
            <nav>
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    toggleSidebar();
                  }}
                  className={`flex items-center p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-semibold">{item.name}</span>
                </div>
              ))}
            </nav>
            <div className="mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="w-full py-2 px-4 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <TopNav toggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 md:p-8 w-full">{renderContent()}</main>
      </div>

      <FloatingContactHub />
      <DoctorSaathiBot />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-0 font-sans w-full">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <DashboardView />
    </div>
  );
};

export default UserPanel;
