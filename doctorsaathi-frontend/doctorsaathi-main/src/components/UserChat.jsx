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
import { Menu, X, Mail, Loader, Stethoscope, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const client = StreamChat.getInstance(apiKey);

const UserChat = () => {
  const { doctorId, patientId } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      try {
        // 🔹 Get user token
        const userRes = await fetch(`${API_BASE_URL}/user/token/${patientId}`);
        const { token: userToken } = await userRes.json();

        // 🔹 Connect user to Stream
        await client.connectUser(
          { id: patientId.toString(), name: `User ${patientId}` },
          userToken
        );

        // 🔹 Ensure doctor exists on Stream
        const doctorRes = await fetch(
          `${API_BASE_URL}/doctor/token/${doctorId}`
        );
        await doctorRes.json();

        // 🔹 Create/get channel
        const channel = client.channel("messaging", {
          members: [patientId.toString(), doctorId.toString()],
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

    const fetchUserDoctor = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/getUserDoctor/details/${doctorId}/${patientId}`
        );
        setDoctor(response?.data?.doctor);
        setUser(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user & doctor data:", error);
      }
    };

    fetchUserDoctor();
    initChat();

    return () => client.disconnectUser();
  }, [doctorId, patientId]);

  // 🔹 Simple Loader (Lucide React)
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-indigo-700 font-medium text-lg">
          Setting up your chat...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-20 bg-indigo-700 text-white shadow-lg h-full w-64 p-5 flex flex-col justify-between transition-transform duration-300 ${
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

          {/* Doctor Info */}
          <div className="text-center space-y-2">
            <img
              src={doctor?.photo}
              alt="Doctor"
              className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-white"
              onError={(e) => (e.target.src = "/doctor-placeholder.png")}
            />
            <h3 className="mt-2 text-lg font-semibold">{doctor?.name}</h3>
            <p className="flex items-center justify-center text-sm space-x-1">
              <Stethoscope size={16} /> <span>{doctor?.specialist}</span>
            </p>
            <p className="flex items-center justify-center text-sm space-x-1">
              <Mail size={16} /> <span>{doctor?.email}</span>
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=0D8ABC&color=fff&size=128`}
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full border"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{user?.name || "User"}</p>
              <p className="flex items-center space-x-1 text-xs">
                <User size={14} /> <span>{user?.email || "user@mail.com"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-600">Consult Chat</h2>
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
    </div>
  );
};

export default UserChat;
