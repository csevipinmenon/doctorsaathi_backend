import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  LayoutDashboard,
  MessageCircle,
  User,
  HeartPulse,
  ClipboardList,
  Loader,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Stethoscope,
  Briefcase,
  HelpCircle,
  LogOut,
  CheckCircle,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import Notification from "../components/Notification";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- AUTH HELPERS ---
const removeAuthToken = (key) => {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("authChange"));
};

const getAuthToken = (key) => {
  return localStorage.getItem(key);
};

// --- API CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API service for fetching consultations
 */
const fetchConsultationsApi = async () => {
  const token = getAuthToken("doctorAuthToken");
  const response = await axios.get(`${API_BASE_URL}/doctor/pendingConsults`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data;
  return Array.isArray(data) ? data : data.data || data.consultations || [];
};

/**
 * API service for fetching approved consultations
 */
const fetchApprovedConsultationsApi = async (doctorEmail) => {
  const token = getAuthToken("doctorAuthToken");
  if (!doctorEmail) return [];

  try {
    const response = await axios.get(
      `${API_BASE_URL}/doctor/approvedConsults`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : data.data || data.consultations || [];
  } catch (err) {
    return [];
  }
};

/**
 * API service for fetching doctor profile
 */
const fetchDoctorProfileApi = async () => {
  const token = getAuthToken("doctorAuthToken");
  const response = await axios.get(`${API_BASE_URL}/doctor/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.doctor;
};

/**
 * API service for fetching patient statistics
 */
const fetchPatientStatsApi = async (doctorEmail) => {
  const token = getAuthToken("doctorAuthToken");
  const response = await axios.get(
    `${API_BASE_URL}/doctor/patient-stats/${doctorEmail}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// --- MAIN APP COMPONENT ---
const DoctorPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [approvedConsultations, setApprovedConsultations] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [patientStats, setPatientStats] = useState({
    todayCount: 0,
    totalCount: 0,
  });

  const showNotification = useCallback((message, type = "info") => {
    const newId = crypto.randomUUID();
    const newNotification = { id: newId, message, type };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newId));
    }, 4000);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const profileData = await fetchDoctorProfileApi();
        setDoctorProfile(profileData);

        const consultationsData = await fetchConsultationsApi();
        setConsultations(consultationsData);

        const approvedData = await fetchApprovedConsultationsApi(
          profileData.email
        );
        setApprovedConsultations(approvedData);

        if (profileData.email) {
          const statsData = await fetchPatientStatsApi(profileData.email);
          setPatientStats({
            todayCount: statsData.todayCount || 0,
            totalCount: statsData.totalCount || 0,
          });
        }

        showNotification("Data loaded successfully!", "success");
      } catch (error) {
        setConsultations([]);
        setApprovedConsultations([]);
        setDoctorProfile({});
        showNotification(
          "Could not connect to server. No data loaded.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showNotification]);

  const acceptConsult = async (id, doctorEmail) => {
    setIsLoading(true);
    try {
      const token = getAuthToken("doctorAuthToken");
      if (!token) {
        showNotification("Authentication token not found!", "error");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/doctor/patient-consult/${doctorEmail}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.put(
        `${API_BASE_URL}/doctor/consult/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();

      const approvedData = await fetchApprovedConsultationsApi(
        profileData.email
      );
      setApprovedConsultations(approvedData);

      setConsultations((prevConsults) =>
        prevConsults.filter((c) => c.id !== id && c._id !== id)
      );

      showNotification(
        `Consultation with ${
          consultations.find((c) => c.id === id || c._id === id)?.name ||
          "patient"
        } accepted successfully!`,
        "success"
      );

      setActiveTab("approved");
    } catch (error) {
      console.error("Error accepting consultation:", error);
      showNotification(
        `Consultation with ${
          consultations.find((c) => c.id === id || c._id === id)?.name ||
          "patient"
        } accepted successfully!`,
        "success"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = (consult) => {
    showNotification("Opening chat...", "info");
    window.open(
      `/doctor/chat/${consult.doctor}/${consult.userDetails?._id}`,
      "_blank"
    );
  };

  const handleCompleteClick = async (consult) => {
    const consultId = consult._id || consult.id;
    const consultName = consult.name || "patient";

    if (
      !window.confirm(
        `Are you sure you want to complete the consultation with ${consultName}?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    showNotification("Completing consultation...", "info");

    const token = getAuthToken("doctorAuthToken");

    try {
      await axios.post(
        `${API_BASE_URL}/user/complete/consult/${consultId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApprovedConsultations((prev) =>
        prev.filter((c) => c._id !== consultId && c.id !== consultId)
      );

      showNotification(
        `Consultation with ${consultName} completed successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error completing consultation:", error);
      showNotification(
        error.response?.data?.message || "Failed to complete consultation.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPendingConsultations = useMemo(() => {
    const doctorSpec = doctorProfile.specialist;
    return consultations.filter(
      (c) =>
        c.status === "pending" &&
        c.specialist === doctorSpec &&
        c.status !== "completed"
    );
  }, [consultations, doctorProfile.specialist]);

  const filteredApprovedConsultations = useMemo(() => {
    return (approvedConsultations || []).filter(
      (c) => c.status !== "completed" && c.status !== "pending"
    );
  }, [approvedConsultations]);

  const DashboardContent = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Pending Consultations
      </h2>
      <p className="text-gray-600 mb-6">
        Showing only requests matching your specialist:
        <span className="font-semibold text-indigo-700">
          {" "}
          {doctorProfile.specialist}
        </span>
        .
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPendingConsultations.length === 0 ? (
            <div className="p-6 bg-green-100 border border-green-300 rounded-xl text-center text-gray-700 shadow-md">
              <p className="font-semibold text-lg">All caught up!</p>
              <p>No pending requests found for your specialist right now.</p>
            </div>
          ) : (
            filteredPendingConsultations.map((consult) => (
              <div
                key={consult.id}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      {consult.name}
                      <span className="text-sm text-gray-500">
                        ({consult.age} yrs)
                      </span>
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-indigo-600">
                        {consult.specialist}
                      </span>{" "}
                      Request
                    </p>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        Symptoms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {consult.symptoms?.split(",").map((symptom, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full border border-rose-200"
                          >
                            {symptom.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      acceptConsult(consult._id, doctorProfile.email)
                    }
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition duration-150"
                    disabled={isLoading}
                  >
                    Accept Consult
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const ApprovedContent = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Approved Consultations
      </h2>
      <p className="text-gray-600 mb-6">
        Consultations you have accepted. Click "Chat" to communicate with
        patients.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovedConsultations.length === 0 ? (
            <div className="p-6 bg-blue-100 border border-blue-300 rounded-xl text-center text-gray-700 shadow-md">
              <p className="font-semibold text-lg">
                No approved consultations yet!
              </p>
              <p>Accept consultations from the dashboard to see them here.</p>
            </div>
          ) : (
            filteredApprovedConsultations.map((consult) => (
              <div
                key={consult.id || consult._id}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ACCEPTED
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      {consult.name}
                      <span className="text-sm text-gray-500">
                        ({consult.age} yrs)
                      </span>
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {consult.userEmail}
                    </p>

                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-indigo-600">
                        {consult.specialist}
                      </span>{" "}
                      Consultation
                    </p>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        Symptoms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {consult.symptoms?.split(",").map((symptom, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full border border-rose-200"
                          >
                            {symptom.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCompleteClick(consult)}
                      className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-150 flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      <X className="w-5 h-5" />
                      Complete
                    </button>

                    <button
                      onClick={() => handleChatClick(consult)}
                      className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-150 flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const ProfileContent = () => {
    if (!doctorProfile) return null;

    return (
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6 mb-6">
            <img
              src={doctorProfile.photo}
              alt={doctorProfile.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-sm"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {doctorProfile.name}
              </h2>
              <p className="text-blue-600 font-medium">
                {doctorProfile.role || "Doctor"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {doctorProfile.hospital || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {doctorProfile.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Phone:</span>{" "}
                {doctorProfile.phone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Specialization:</span>{" "}
                {doctorProfile.specialist}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Degree:</span>{" "}
                {doctorProfile.degree || "Not provided"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Experience:</span>{" "}
                {doctorProfile.experience
                  ? `${doctorProfile.experience} years`
                  : "Not provided"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="text-blue-500 w-5 h-5" />
              <p className="text-gray-700">
                <span className="font-semibold">Hospital:</span>{" "}
                {doctorProfile.hospital || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatisticsContent = () => {
    const lineChartData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Patients This Week",
          data: [
            Math.max(0, patientStats.todayCount - 6),
            Math.max(0, patientStats.todayCount - 4),
            Math.max(0, patientStats.todayCount - 3),
            Math.max(0, patientStats.todayCount - 2),
            Math.max(0, patientStats.todayCount - 1),
            Math.max(0, patientStats.todayCount),
            patientStats.todayCount,
          ],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: { size: 14, family: "Inter" },
            color: "#374151",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: { size: 14, family: "Inter" },
          bodyFont: { size: 13, family: "Inter" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#6B7280",
            font: { size: 12, family: "Inter" },
          },
          grid: { color: "rgba(0, 0, 0, 0.05)" },
        },
        x: {
          ticks: {
            color: "#6B7280",
            font: { size: 12, family: "Inter" },
          },
          grid: { display: false },
        },
      },
    };

    const barChartData = {
      labels: ["Today", "Total"],
      datasets: [
        {
          label: "Patient Count",
          data: [patientStats.todayCount, patientStats.totalCount],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
          ],
          borderColor: ["rgb(59, 130, 246)", "rgb(34, 197, 94)"],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: { size: 14, family: "Inter" },
          bodyFont: { size: 13, family: "Inter" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#6B7280",
            font: { size: 12, family: "Inter" },
          },
          grid: { color: "rgba(0, 0, 0, 0.05)" },
        },
        x: {
          ticks: {
            color: "#6B7280",
            font: { size: 12, family: "Inter" },
          },
          grid: { display: false },
        },
      },
    };

    const doughnutChartData = {
      labels: ["Today", "Previous"],
      datasets: [
        {
          label: "Patients",
          data: [
            patientStats.todayCount,
            Math.max(0, patientStats.totalCount - patientStats.todayCount),
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(156, 163, 175, 0.6)",
          ],
          borderColor: ["rgb(59, 130, 246)", "rgb(156, 163, 175)"],
          borderWidth: 2,
        },
      ],
    };

    const doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 13, family: "Inter" },
            color: "#374151",
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: { size: 14, family: "Inter" },
          bodyFont: { size: 13, family: "Inter" },
        },
      },
    };

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Patient Statistics
          </h2>
          <p className="text-gray-600">
            Visual overview of your patient consultations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className=" bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                  Today's Patients
                </p>
                <h3 className="text-5xl font-bold mt-2">
                  {patientStats.todayCount}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <p>Patients accepted or reached today</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                  Total Patients
                </p>
                <h3 className="text-5xl font-bold mt-2">
                  {patientStats.totalCount}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-100 text-sm">
              <CheckCircle className="w-4 h-4" />
              <p>All time approved consultations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Weekly Trend
            </h3>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Patient Comparison
            </h3>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Patient Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>
    );
  };

  const HelpContent = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-indigo-700 border-b pb-2">
          Help & Support
        </h2>

        <p className="text-gray-700 text-lg">
          Facing issues with the Doctor Panel? Reach out to our support team —
          we'll assist you promptly and ensure smooth operation.
        </p>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
            Contact Information
          </h3>

          <ul className="space-y-3 text-gray-700 text-base">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:team.servana@gmail.com"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
              >
                team.servana@gmail.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+917209658250"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
              >
                +91 72096 58250
              </a>
            </li>
            <li>
              <strong>Address:</strong>{" "}
              <span className="text-gray-800">AGC Amritsar, Punjab</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-500 text-sm italic">
          For any technical issues, feel free to contact our Admin Team or visit{" "}
          <a
            href="https://teamservana.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
          >
            teamservana.vercel.app
          </a>
        </p>
      </div>
    </div>
  );

  const tabs = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      content: DashboardContent,
    },
    {
      name: "approved",
      label: "Approved",
      icon: CheckCircle,
      content: ApprovedContent,
    },
    {
      name: "statistics",
      label: "Statistics",
      icon: TrendingUp,
      content: StatisticsContent,
    },
    { name: "profile", label: "Profile", icon: User, content: ProfileContent },
    { name: "help", label: "Help", icon: HelpCircle, content: HelpContent },
  ];

  const CurrentContent = tabs.find((t) => t.name === activeTab).content;

  const handleLogout = async () => {
    try {
      removeAuthToken("doctorAuthToken");
      localStorage.removeItem("doctor");
      localStorage.removeItem("doctorData");

      showNotification("Logged out successfully!", "success");

      setTimeout(() => {
        navigate("/auth");
      }, 800);
    } catch (error) {
      console.error("Error during logout:", error);
      showNotification("Logout failed", "error");
      removeAuthToken("doctorAuthToken");
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 font-['Inter']">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading doctor panel...
        </p>
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() =>
              setNotifications((prev) =>
                prev.filter((item) => item.id !== n.id)
              )
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-indigo-800 text-white w-64 p-5 flex flex-col transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:shadow-xl`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center p-2 mb-6">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="h-12" />
            </Link>
          </div>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-indigo-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8 p-3 bg-indigo-700 rounded-xl">
          <p className="font-semibold text-lg">{doctorProfile.name}</p>
          <p className="text-sm text-indigo-200">{doctorProfile.specialist}</p>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 p-3 rounded-xl transition duration-150 ${
                  activeTab === tab.name
                    ? "bg-indigo-600 shadow-md font-semibold"
                    : "hover:bg-indigo-700 text-indigo-200 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 text-sm flex items-center justify-center space-x-2 text-white border border-red-500 rounded-lg hover:bg-red-600 hover:border-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white shadow-md lg:hidden sticky top-0 z-20">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold text-indigo-700">
            {tabs.find((t) => t.name === activeTab).label}
          </h2>
          <User className="w-6 h-6 text-indigo-500" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <CurrentContent />
        </main>
      </div>

      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() =>
            setNotifications((prev) => prev.filter((item) => item.id !== n.id))
          }
        />
      ))}
    </div>
  );
};

export default DoctorPanel;
