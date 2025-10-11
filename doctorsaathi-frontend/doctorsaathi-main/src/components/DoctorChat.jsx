import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import {
  Menu,
  X,
  Mail,
  Loader,
  Phone,
  Video,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const client = StreamChat.getInstance(apiKey);

const DoctorChat = () => {
  const { doctorId, patientId } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prescription modal state
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [sendingPrescription, setSendingPrescription] = useState(false);
  const [prescriptionStatus, setPrescriptionStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const initChat = async () => {
      try {
        // 🔹 Get doctor token
        const doctorRes = await fetch(
          `${API_BASE_URL}/doctor/token/${doctorId}`
        );
        const { token: doctorToken } = await doctorRes.json();

        // 🔹 Connect doctor
        await client.connectUser(
          { id: doctorId.toString(), name: `Doctor ${doctorId}` },
          doctorToken
        );

        // 🔹 Ensure patient exists
        const patientRes = await fetch(
          `${API_BASE_URL}/user/token/${patientId}`
        );
        await patientRes.json();

        // 🔹 Create/get channel
        const channel = client.channel("messaging", {
          members: [doctorId.toString(), patientId.toString()],
          name: "Consult Chat",
        });
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctorUser = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/getUserDoctor/details/${doctorId}/${patientId}`
        );
        setDoctor(response?.data?.doctor);
        setUser(response?.data?.user);
      } catch (error) {
        console.error("Error fetching doctor & user data:", error);
      }
    };

    fetchDoctorUser();
    initChat();

    return () => client.disconnectUser();
  }, [doctorId, patientId]);

  const handleSendPrescription = async () => {
    if (!prescriptionText.trim()) {
      alert("Please enter prescription details");
      return;
    }

    setSendingPrescription(true);
    setPrescriptionStatus(null);

    const token = localStorage.getItem("doctorAuthToken");

    try {
      await axios.post(
        `${API_BASE_URL}/doctor/addPrescription`,
        {
          userId: patientId,
          prescription: prescriptionText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrescriptionStatus("success");
      setTimeout(() => {
        setShowPrescriptionModal(false);
        setPrescriptionText("");
        setPrescriptionStatus(null);
      }, 2000);
    } catch (error) {
      console.error("Error sending prescription:", error);
      setPrescriptionStatus("error");
    } finally {
      setSendingPrescription(false);
    }
  };

  // 🔹 Lucide Loader
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-indigo-700 font-medium text-lg">
          Connecting your chat...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-20 bg-indigo-800 text-white shadow-lg h-full w-64 p-5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Close */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="h-12" />
            </Link>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* User (Patient) Info */}
          <div className="text-center space-y-2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=0D8ABC&color=fff&size=128`}
              alt={user?.name || "User"}
              className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-white"
            />
            <h3 className="mt-2 text-lg font-semibold">{user?.name}</h3>
            <p className="flex items-center justify-center text-sm space-x-1">
              <User size={16} /> <span>{user?.email}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <a
              href={`tel:+91${user?.phone}`}
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <Phone size={20} />
              <span>Voice Call</span>
            </a>

            <a
              href={`https://wa.me/+91${user?.phone}`}
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <Video size={20} />
              <span>Video Call </span>
            </a>
            <a
              href={`https://meet.google.com/landing`}
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <Video size={20} />
              <span>Start Meeting</span>
            </a>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <FileText size={20} />
              <span>Send Prescription</span>
            </button>
          </div>
        </div>

        {/* Doctor Info (Bottom) */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center space-x-3">
            <img
              src={doctor?.photo || "/doctor-placeholder.png"}
              alt="Doctor"
              className="w-10 h-10 rounded-full border object-cover"
              onError={(e) => (e.target.src = "/doctor-placeholder.png")}
            />
            <div className="flex flex-col">
              <p className="font-semibold">{doctor?.name || "Doctor"}</p>
              <p className="flex items-center space-x-1 text-xs">
                <Mail size={14} /> <span>{doctor?.email || "N/A"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-indigo-600">Doctor Chat</h2>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Chat Section */}
        <div className="flex-1">
          <Chat client={client} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={24} />
                <h2 className="text-xl font-semibold">Send Prescription</h2>
              </div>
              <button
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setPrescriptionText("");
                  setPrescriptionStatus(null);
                }}
                className="hover:bg-indigo-700 p-1 rounded transition-colors"
                disabled={sendingPrescription}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Patient:{" "}
                  <span className="font-semibold text-gray-800">
                    {user?.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Doctor:{" "}
                  <span className="font-semibold text-gray-800">
                    {doctor?.name}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription Details
                </label>
                <textarea
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="Prescription : Paracetamol 500 mg
                  Dosage : 1 tablet orally every 6–8 hours as needed (Max 4g/day)
                  FollowUp : Monitor temperature; if fever persists more than 3 days or >102°F, consult a doctor
                  "
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  disabled={sendingPrescription}
                />
              </div>

              {/* Status Messages */}
              {prescriptionStatus === "success" && (
                <div className="mb-4 flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                  <CheckCircle size={20} />
                  <span className="font-medium">
                    Prescription sent successfully!
                  </span>
                </div>
              )}

              {prescriptionStatus === "error" && (
                <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                  <AlertCircle size={20} />
                  <span className="font-medium">
                    Failed to send prescription. Please try again.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setPrescriptionText("");
                    setPrescriptionStatus(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={sendingPrescription}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendPrescription}
                  disabled={sendingPrescription || !prescriptionText.trim()}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sendingPrescription ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      <span>Send Prescription</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChat;
