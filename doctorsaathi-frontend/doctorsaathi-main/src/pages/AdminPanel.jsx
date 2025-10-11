import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Mail,
  Loader,
  Menu,
  X,
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Calendar,
  IdCard,
  Download,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  MessageSquare,
  Stethoscope,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
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
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- AUTHENTICATION COMPONENT ---
const LoginScreen = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    if (token) {
      setLoggedIn(true);
      setIsLoading(false);
    }
  }, [setLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    axios
      .post(`${API_BASE_URL}/user/login`, { email, password })
      .then((response) => {
        if (response.data && response.data.token) {
          setLoggedIn(true);
          localStorage.setItem("adminAuthToken", response.data.token);
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50 font-['Inter']">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Admin Login
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
              placeholder="Enter Email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Simulated environment variable check.
        </p>
      </div>
    </div>
  );
};

// --- GENERAL UTILITY COMPONENTS ---
const FormInput = ({
  label,
  name,
  type = "text",
  Icon,
  value,
  onChange,
  children,
  required = true,
  isTextArea = false,
  ...props
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-xl shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>

      {children ? (
        children
      ) : isTextArea ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          rows="2"
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
        ></textarea>
      ) : type === "file" ? (
        <input
          type="file"
          name={name}
          onChange={onChange}
          required={required}
          {...props}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          {...props}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      )}
    </div>
  </div>
);

// --- STATISTICS COMPONENT ---
const Statistics = () => {
  const [doctorStats, setDoctorStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorStats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("adminAuthToken");
        const response = await axios.get(
          `${API_BASE_URL}/admin/alldoctors-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctorStats(response.data.data || []);
        setError("");
      } catch (err) {
        setError("Failed to load doctor statistics");
        setDoctorStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-xl">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  // Calculate totals
  const totalTodayConsults = doctorStats.reduce(
    (sum, doc) => sum + (doc.todayCount || 0),
    0
  );
  const totalAllConsults = doctorStats.reduce(
    (sum, doc) => sum + (doc.totalCount || 0),
    0
  );

  // Prepare data for charts
  const doctorNames = doctorStats.map(
    (doc) => doc.doctorDetails?.name || "Unknown"
  );
  const todayCounts = doctorStats.map((doc) => doc.todayCount || 0);
  const totalCounts = doctorStats.map((doc) => doc.totalCount || 0);

  // Color palette
  const colors = [
    "rgba(59, 130, 246, 0.8)",
    "rgba(16, 185, 129, 0.8)",
    "rgba(245, 158, 11, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(139, 92, 246, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(34, 197, 94, 0.8)",
  ];

  const borderColors = [
    "rgb(59, 130, 246)",
    "rgb(16, 185, 129)",
    "rgb(245, 158, 11)",
    "rgb(239, 68, 68)",
    "rgb(139, 92, 246)",
    "rgb(236, 72, 153)",
    "rgb(14, 165, 233)",
    "rgb(34, 197, 94)",
  ];

  // Bar Chart - Today vs Total by Doctor
  const barChartData = {
    labels: doctorNames,
    datasets: [
      {
        label: "Today's Consultations",
        data: todayCounts,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Total Consultations",
        data: totalCounts,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
          font: { size: 11, family: "Inter" },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
    },
  };

  // Pie Chart - Today's Distribution
  const pieChartData = {
    labels: doctorNames,
    datasets: [
      {
        label: "Today's Consultations",
        data: todayCounts,
        backgroundColor: colors.slice(0, doctorStats.length),
        borderColor: borderColors.slice(0, doctorStats.length),
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12, family: "Inter" },
          color: "#374151",
          padding: 10,
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

  // Doughnut Chart - Total Distribution
  const doughnutChartData = {
    labels: doctorNames,
    datasets: [
      {
        label: "Total Consultations",
        data: totalCounts,
        backgroundColor: colors.slice(0, doctorStats.length),
        borderColor: borderColors.slice(0, doctorStats.length),
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12, family: "Inter" },
          color: "#374151",
          padding: 10,
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

  // Line Chart - Trend Comparison
  const lineChartData = {
    labels: doctorNames,
    datasets: [
      {
        label: "Today's Consultations",
        data: todayCounts,
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
      {
        label: "Total Consultations",
        data: totalCounts,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(34, 197, 94)",
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
        position: "top",
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
          font: { size: 11, family: "Inter" },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
    },
  };

  // Top Performers
  const topPerformersToday = [...doctorStats]
    .sort((a, b) => (b.todayCount || 0) - (a.todayCount || 0))
    .slice(0, 5);

  const topPerformersTotal = [...doctorStats]
    .sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Doctor Statistics Dashboard
        </h2>
        <p className="text-gray-600">
          Comprehensive overview of all doctor consultations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className=" bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                Today's Total
              </p>
              <h3 className="text-5xl font-bold mt-2">{totalTodayConsults}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <TrendingUp className="w-4 h-4" />
            <p>Consultations today</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                All Time Total
              </p>
              <h3 className="text-5xl font-bold mt-2">{totalAllConsults}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-100 text-sm">
            <TrendingUp className="w-4 h-4" />
            <p>Total consultations</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">
                Active Doctors
              </p>
              <h3 className="text-5xl font-bold mt-2">{doctorStats.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-100 text-sm">
            <Users className="w-4 h-4" />
            <p>Registered doctors</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Consultations Comparison
          </h3>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Trend Analysis
          </h3>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Today's Distribution
          </h3>
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Total Distribution
          </h3>
          <div className="h-80">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Today */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Performers Today
          </h3>
          <div className="space-y-3">
            {topPerformersToday.map((doc, idx) => (
              <div
                key={doc._id || idx}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {doc.doctorDetails?.name}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {doc.doctorEmail}
                    </p>
                  </div>
                </div>
                <p className="text-xs mr-10 text-gray-500">
                  {doc.doctorDetails?.specialist}
                </p>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {doc.todayCount}
                  </p>
                  <p className="text-xs text-gray-500">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers All Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Top Performers All Time
          </h3>
          <div className="space-y-3">
            {topPerformersTotal.map((doc, idx) => (
              <div
                key={doc._id || idx}
                className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {doc.doctorDetails?.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.doctorEmail}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {doc.doctorDetails?.specialist}
                </p>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {doc.totalCount}
                  </p>
                  <p className="text-xs text-gray-500">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Detailed Doctor Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Doctor Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Doctor Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Specialty
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Today
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Average/Day
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctorStats.map((doc, idx) => (
                <tr key={doc._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doc.doctorDetails?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {doc.doctorEmail}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {doc.doctorDetails?.specialist}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-blue-600">
                      {doc.todayCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-green-600">
                      {doc.totalCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-600">
                      {doc.totalCount > 0
                        ? (doc.totalCount / 30).toFixed(1)
                        : "0.0"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- ASHA WORKER MANAGEMENT COMPONENTS ---
const AshaRegistrationForm = ({
  addAshaWorker,
  setEditingAsha,
  editingAsha,
}) => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    gender: "Female",
    age: "",
    location: "",
    aadhar: "",
    pincode: "",
  };

  const [formData, setFormData] = useState(editingAsha || initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    setFormData(editingAsha || initialState);
  }, [editingAsha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.post(
        `${API_BASE_URL}/admin/aashaRegister`,
        {
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          gender: formData.gender || "",
          age: formData.age || "",
          location: formData.location || "",
          Aadhar: formData.aadhar || "",
          pincode: formData.pincode || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      addAshaWorker(response.data);
      setFormData(initialState);
      setEditingAsha(null);
      setNotification({
        message: "ASHA registered successfully!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message:
          "Failed to register ASHA. Please check the details and try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-2xl shadow-xl">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <h3 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-3" />
        {editingAsha ? "Edit ASHA Worker" : "Add ASHA Worker"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormInput
          label="Name"
          name="name"
          Icon={Users}
          value={formData.name}
          onChange={handleChange}
        />
        <FormInput
          label="Email"
          name="email"
          Icon={Mail}
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormInput
          label="Mobile Number"
          name="phone"
          Icon={Phone}
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <FormInput
          label="Pincode"
          name="pincode"
          Icon={MapPin}
          type="text"
          value={formData.pincode}
          onChange={handleChange}
        />
        <FormInput
          label="Age"
          name="age"
          Icon={Calendar}
          type="text"
          value={formData.age}
          onChange={handleChange}
        />
        <FormInput
          label="Aadhar Number"
          name="aadhar"
          Icon={IdCard}
          type="text"
          value={formData.aadhar}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <FormInput
            label="Address"
            name="location"
            Icon={MapPin}
            value={formData.location}
            onChange={handleChange}
            isTextArea={true}
          />
        </div>
        <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
          {editingAsha && (
            <button
              type="button"
              onClick={() => setEditingAsha(null)}
              className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-xl shadow-md hover:bg-gray-400 transition duration-200"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300 flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Users className="w-5 h-5 mr-2" />
            )}
            {isSubmitting
              ? editingAsha
                ? "Updating..."
                : "Adding..."
              : editingAsha
              ? "Save Changes"
              : "Register ASHA"}
          </button>
        </div>
      </form>
    </div>
  );
};

const AshaTable = ({ ashaWorkers, deleteAshaWorker, setEditingAsha }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return ashaWorkers.filter(
      (worker) =>
        (worker.name || "").toLowerCase().includes(lowerSearch) ||
        (worker.email || "").toLowerCase().includes(lowerSearch) ||
        (worker.pincode || "").includes(searchTerm)
    );
  }, [ashaWorkers, searchTerm]);

  const TableHeader = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="w-6 h-6 mr-3 text-indigo-600" />
        All ASHA Workers ({ashaWorkers.length})
      </h3>
      <div className="relative flex-1 mb-6">
        <input
          type="text"
          placeholder="Search by Name, Email, or Pincode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Name / Email</TableHeader>
              <TableHeader>Mobile</TableHeader>
              <TableHeader>Pincode / Gender</TableHeader>
              <TableHeader>Address</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWorkers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No ASHA workers found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredWorkers.map((worker) => (
                <tr key={worker._id || worker.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {worker.name}
                    </div>
                    <div className="text-xs text-gray-500">{worker.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {worker.pincode}
                    </span>
                    <br />
                    <span className="text-xs">{worker.gender}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {worker.location}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingAsha(worker)}
                      className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200 transform hover:scale-110"
                      aria-label={`Edit worker ${worker.name}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        deleteAshaWorker(worker._id || worker.id, worker.name)
                      }
                      className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                      aria-label={`Remove worker ${worker.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AshaManagement = ({ ashaWorkers, setAshaWorkers }) => {
  const [editingAsha, setEditingAsha] = useState(null);

  // Add ASHA Worker (API)
  const addAshaWorker = (workerData) => {
    setAshaWorkers((prev) => {
      // If editing, replace; else add
      if (workerData._id) {
        return prev.map((w) => (w._id === workerData._id ? workerData : w));
      }
      return [...prev, workerData];
    });
  };

  // Delete ASHA Worker (API)
  const deleteAshaWorker = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to remove ASHA worker ${name}?`)
    ) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        await axios.delete(`${API_BASE_URL}/admin/ashas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAshaWorkers((prev) =>
          prev.filter((w) => w._id !== id && w.id !== id)
        );
      } catch (err) {
        alert("Failed to delete ASHA worker.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <AshaRegistrationForm
        addAshaWorker={addAshaWorker}
        setEditingAsha={setEditingAsha}
        editingAsha={editingAsha}
      />
      <AshaTable
        ashaWorkers={ashaWorkers}
        deleteAshaWorker={deleteAshaWorker}
        setEditingAsha={setEditingAsha}
      />
    </div>
  );
};

// --- DOCTOR MANAGEMENT COMPONENTS ---

const DoctorRegistrationForm = ({
  addDoctor,
  setEditingDoctor,
  editingDoctor,
}) => {
  const initialState = {
    name: "",
    phone: "",
    degree: "",
    gender: "",
    experience: "",
    specialist: "",
    hospital: "",
    age: "",
    pincode: "",
    email: "",
    password: "",
    photo: null,
  };
  const [formData, setFormData] = useState(editingDoctor || initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    setFormData(editingDoctor || initialState);
  }, [editingDoctor]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();

    // --- Append all text fields ---
    formDataObj.append("name", formData.name || "");
    formDataObj.append("email", formData.email || "");
    formDataObj.append("phone", formData.phone || "");
    formDataObj.append("password", formData.password || "");
    formDataObj.append("gender", formData.gender || "");
    formDataObj.append("hospital", formData.hospital || "");
    formDataObj.append("age", formData.age || "");
    formDataObj.append("pincode", formData.pincode || "");
    formDataObj.append("experience", formData.experience || "");
    formDataObj.append("degree", formData.degree || "");
    formDataObj.append("specialist", formData.specialist || "");

    // FIX: Only append the photo if it is a File object.
    // This prevents sending null/undefined which can corrupt the FormData stream.
    if (formData.photo instanceof File) {
      formDataObj.append("photo", formData.photo);
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://doctorsaathibackend.onrender.com/doctorsaathi/doctor/signup",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-2xl shadow-xl">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <h3 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
        <Stethoscope className="w-6 h-6 mr-3" />
        {editingDoctor ? "Edit Doctor" : "Add Doctor"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        encType="multipart/form-data"
      >
        <FormInput
          label="Name"
          type="text"
          name="name"
          Icon={Users}
          value={formData.name}
          onChange={handleChange}
        />
        <FormInput
          label="Phone"
          type="tel"
          name="phone"
          Icon={Phone}
          value={formData.phone}
          onChange={handleChange}
        />
        <FormInput
          label="Degree"
          type="text"
          name="degree"
          Icon={GraduationCap}
          value={formData.degree}
          onChange={handleChange}
        />
        <FormInput
          label="Gender"
          type="text"
          name="gender"
          Icon={Users}
          value={formData.gender}
          onChange={handleChange}
        >
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormInput>
        <FormInput
          label="Experience (years)"
          type="number"
          name="experience"
          Icon={Briefcase}
          value={formData.experience}
          onChange={handleChange}
        />
        <FormInput
          label="Specialist"
          type="text"
          name="specialist"
          Icon={Stethoscope}
          value={formData.specialist}
          onChange={handleChange}
        >
          <select
            name="specialist"
            typeof="text"
            value={formData.specialist}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            <option value="">Select Specialist</option>
            <option value="General Physician">General Physician</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Endocrinologist">Endocrinologist</option>
          </select>
        </FormInput>
        <FormInput
          label="Hospital"
          name="hospital"
          Icon={Briefcase}
          value={formData.hospital}
          onChange={handleChange}
        />
        <FormInput
          label="Age"
          name="age"
          Icon={Calendar}
          value={formData.age}
          onChange={handleChange}
        />
        <FormInput
          label="Pincode"
          name="pincode"
          Icon={MapPin}
          value={formData.pincode}
          onChange={handleChange}
        />
        <FormInput
          label="Email"
          name="email"
          Icon={Mail}
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormInput
          label="Password"
          name="password"
          Icon={IdCard}
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <FormInput
          label="Upload Photo"
          name="photo"
          Icon={MessageSquare}
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, photo: e.target.files[0] })
          }
        />

        <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
          {editingDoctor && (
            <button
              type="button"
              onClick={() => setEditingDoctor(null)}
              className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-xl shadow-md hover:bg-gray-400 transition duration-200"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300 flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Stethoscope className="w-5 h-5 mr-2" />
            )}
            {isSubmitting
              ? editingDoctor
                ? "Updating..."
                : "Adding..."
              : editingDoctor
              ? "Save Changes"
              : "Register Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

const DoctorTable = ({ doctors, deleteDoctor, setEditingDoctor }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(lowerSearch) ||
        (doctor.email || "").toLowerCase().includes(lowerSearch) ||
        (doctor.specialist || "").toLowerCase().includes(lowerSearch)
    );
  }, [doctors, searchTerm]);

  const TableHeader = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
        All Doctors ({doctors.length})
      </h3>
      <div className="relative flex-1 mb-6">
        <input
          type="text"
          placeholder="Search by Name, Email, or Specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Name / Email</TableHeader>
              <TableHeader>Specialty</TableHeader>
              <TableHeader>Mobile</TableHeader>
              <TableHeader>Degree</TableHeader>
              <TableHeader>Hospital</TableHeader>
              <TableHeader>Photo</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No doctors found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => (
                <tr key={doctor._id || doctor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doctor.name}
                    </div>
                    <div className="text-xs text-gray-500">{doctor.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                    {doctor.specialist}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.degree}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.hospital}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.photo ? (
                      <img
                        src={doctor.photo}
                        alt="Doctor"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingDoctor(doctor)}
                      className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200 transform hover:scale-110"
                      aria-label={`Edit doctor ${doctor.name}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        deleteDoctor(doctor._id || doctor.id, doctor.name)
                      }
                      className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                      aria-label={`Remove doctor ${doctor.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DoctorManagement = ({ doctors, setDoctors }) => {
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Add Doctor (API)
  const addDoctor = (doctorData) => {
    setDoctors((prev) => {
      if (doctorData._id) {
        return prev.map((d) => (d._id === doctorData._id ? doctorData : d));
      }
      return [...prev, doctorData];
    });
  };

  // Delete Doctor (API)
  const deleteDoctor = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove doctor ${name}?`)) {
      try {
        const token = localStorage.getItem("adminAuthToken");
        await axios.delete(`${API_BASE_URL}/admin/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors((prev) => prev.filter((d) => d._id !== id && d.id !== id));
      } catch (err) {
        alert("Failed to delete doctor.");
      }
    }
  };

  return (
    <div className="space-y-10">
      <DoctorRegistrationForm
        addDoctor={addDoctor}
        setEditingDoctor={setEditingDoctor}
        editingDoctor={editingDoctor}
      />
      <DoctorTable
        doctors={doctors}
        deleteDoctor={deleteDoctor}
        setEditingDoctor={setEditingDoctor}
      />
    </div>
  );
};

// --- PATIENT VIEW AND CSV EXPORT (API) ---

const PatientList = ({ patients }) => {
  const handleExportCSV = () => {
    if (patients.length === 0) {
      window.alert("No patient data to export.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Age",
      "Gender",
      "Phone No",
      "Symptoms",
      "Specialist",
      "Status",
      "Admitted Date",
    ];

    const csvData = patients.map((p) => ({
      ID: p.id,
      Name: p.name,
      Email: p.email,
      Age: p.age,
      Gender: p.gender,
      "Phone No": p.phone,
      Symptoms: p.symptoms,
      Specialist: p.specialist,
      Status: p.status,
      "Admitted Date": p.admitted,
    }));

    const csvContent =
      headers.join(",") +
      "\n" +
      csvData
        .map((row) =>
          headers
            .map((header) => {
              const content = row[header] || "";
              return `"${content.toString().replace(/"/g, '""')}"`;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "patient_data_export.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const TableHeader = ({ children }) => (
    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-indigo-600" />
          All Patient Records ({patients.length})
        </h2>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition duration-200 flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Name / Contact</TableHeader>
              <TableHeader>Age / Gender</TableHeader>
              <TableHeader>Symptoms / Specialist</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {patient.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {patient.email} / {patient.phone}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-semibold">{patient.age}</span> /{" "}
                  {patient.gender.charAt(0)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div
                    className="text-xs font-medium text-gray-900 truncate max-w-xs"
                    title={patient.symptoms}
                  >
                    {patient.symptoms}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">
                    {patient.specialist}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- USER LIST & EXPORT COMPONENT ---

const UserList = ({ users }) => {
  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      window.alert("No user data to export.");
      return;
    }

    const headers = ["Name", "Gender", "Phone", "Email", "Age", "Pincode"];
    const csvData = users.map((u) => ({
      Name: u.name,
      Gender: u.gender,
      Phone: u.phone,
      Email: u.email,
      Age: u.age,
      Pincode: u.pincode,
    }));

    const csvContent =
      headers.join(",") +
      "\n" +
      csvData
        .map((row) =>
          headers
            .map((header) => {
              const content = row[header] || "";
              return `"${content.toString().replace(/"/g, '""')}"`;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all_users_export.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const TableHeader = ({ children }) => (
    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 mt-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-3 text-indigo-600" />
          All Users ({users.length})
        </h2>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition duration-200 flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Gender</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Age</TableHeader>
              <TableHeader>Pincode</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id || user._id}>
                <td className="px-3 py-4">{user.name}</td>
                <td className="px-3 py-4">{user.gender}</td>
                <td className="px-3 py-4">{user.phone}</td>
                <td className="px-3 py-4">{user.email}</td>
                <td className="px-3 py-4">{user.age}</td>
                <td className="px-3 py-4">{user.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="text-center p-10 text-gray-500">No users found.</div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("asha");

  const [ashaWorkers, setAshaWorkers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("adminAuthToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [ashaRes, doctorRes, patientRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/all-aashas`, config),
          axios.get(`${API_BASE_URL}/admin/alldoctors`, config),
          axios.get(`${API_BASE_URL}/admin/allConsults`, config),
          axios.get(`${API_BASE_URL}/admin/allusers`, config),
        ]);
        setAshaWorkers(
          Array.isArray(ashaRes.data?.users) ? ashaRes.data.users : []
        );
        setDoctors(
          Array.isArray(doctorRes.data?.users) ? doctorRes.data.users : []
        );
        setPatients(
          Array.isArray(patientRes.data?.consultations)
            ? patientRes.data.consultations
            : []
        );
        setUsers(Array.isArray(userRes.data?.users) ? userRes.data.users : []);
      } catch (error) {
        setAshaWorkers([]);
        setDoctors([]);
        setPatients([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const navigate = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen setLoggedIn={setIsLoggedIn} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 font-['Inter']">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading administrative data...
        </p>
      </div>
    );
  }

  const NavItem = ({ view, currentView, onClick, Icon, label }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-xl transition ${
        currentView === view
          ? "bg-indigo-700 text-white shadow-md"
          : "hover:bg-indigo-700 text-indigo-100"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );

  const Sidebar = () => (
    <div
      className={`
      fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } 
      lg:relative lg:translate-x-0 transition duration-300 ease-in-out 
      w-64 bg-indigo-800 text-white z-20 shadow-xl lg:flex lg:flex-col
    `}
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center p-2 mt-6">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>
        </div>
        <button
          className="lg:hidden p-2 m-4 rounded-full hover:bg-indigo-700"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavItem
          view="asha"
          currentView={currentView}
          onClick={() => navigate("asha")}
          Icon={Users}
          label="ASHA Management"
        />
        <NavItem
          view="doctors"
          currentView={currentView}
          onClick={() => navigate("doctors")}
          Icon={Stethoscope}
          label="Doctor Management"
        />
        <NavItem
          view="patients"
          currentView={currentView}
          onClick={() => navigate("patients")}
          Icon={MessageSquare}
          label="Patient Records"
        />
        <NavItem
          view="users"
          currentView={currentView}
          onClick={() => navigate("users")}
          Icon={Users}
          label="All Users"
        />
        <NavItem
          view="Statistics"
          currentView={currentView}
          onClick={() => navigate("Statistics")}
          Icon={TrendingUp}
          label="Statistics"
        />
      </nav>

      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem("adminAuthToken");
          }}
          className="w-full text-center py-2 bg-indigo-700 text-indigo-100 rounded-xl hover:bg-indigo-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case "asha":
        return (
          <AshaManagement
            ashaWorkers={ashaWorkers}
            setAshaWorkers={setAshaWorkers}
          />
        );
      case "doctors":
        return <DoctorManagement doctors={doctors} setDoctors={setDoctors} />;
      case "patients":
        return <PatientList patients={patients} ashaWorkers={ashaWorkers} />;
      case "users":
        return <UserList users={users} />;
      case "Statistics":
        return <Statistics Statistics={Statistics} />;
      default:
        return (
          <AshaManagement
            ashaWorkers={ashaWorkers}
            setAshaWorkers={setAshaWorkers}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-['Inter']">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white shadow-md p-4 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-700">
            {currentView === "asha"
              ? "ASHA Management"
              : currentView === "doctors"
              ? "Doctor Management"
              : currentView === "patients"
              ? "Patient Records"
              : currentView === "Statistics"
              ? "Statistics"
              : "All Users"}
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
