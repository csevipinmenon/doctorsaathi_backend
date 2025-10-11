import React, { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const key = import.meta.env.VITE_GEMINI_KEY;

export default function DoctorSaathiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    const question = input.trim();
    if (!question) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setInput("");

    // Show loading
    setMessages((prev) => [...prev, { type: "bot", text: "loading..." }]);

    const lowerQuestion = question.toLowerCase();
    const customQA = {
      "what services do you provide?":
        "We provide telemedicine consultations, health advice, doctor appointments, and digital prescriptions.",

      "how to book an appointment?":
        "Select a doctor from the list, choose a suitable time slot, and confirm your appointment online.",

      "who are you?":
        "I am DoctorSaathi Bot, your digital healthcare assistant!",

      "is there any fee for using DoctorSaathi?":
        "No, DoctorSaathi is fully government-supported. All consultations, appointments, and online services are completely free for patients.",

      "how can I create an account?":
        "Click on 'Sign Up', fill in your details, verify your email or phone number, and your account will be ready.",

      "i forgot my password. how can I reset it?":
        "Click 'Forgot Password' on the login page, enter your registered email or phone, and follow the reset instructions.",

      "can I update my profile information?":
        "Yes, go to your profile settings and edit your personal details, contact info, or address.",

      "can I delete my account?":
        "Yes, contact our support team or request account deletion from your profile settings.",

      "can I book same-day or emergency appointments?":
        "Yes, depending on doctor availability. For emergencies, please contact your nearest hospital.",

      "how can I reschedule or cancel an appointment?":
        "Go to 'My Appointments', select the appointment, and choose 'Reschedule' or 'Cancel'.",

      "will I get a confirmation after booking?":
        "Yes, a confirmation will be sent via email or SMS with all appointment details.",

      "how do I find a doctor on DoctorSaathi?":
        "Use the search bar to filter by specialty, location, availability, or doctor name.",

      "can I consult doctors online?":
        "Yes, DoctorSaathi provides secure video and chat consultations with verified doctors.",

      "are the doctors verified?":
        "Yes, all doctors go through credential verification before joining our platform.",

      "can I choose a doctor for follow-up appointments?":
        "Yes, you can select the same doctor for continuity of care.",

      "how much does an online consultation cost?":
        "DoctorSaathi is fully government-supported. All consultations are completely free.",

      "can I upload my medical reports?":
        "Yes, you can securely upload medical reports to share with doctors during consultations.",

      "will I receive prescriptions digitally?":
        "Yes, after consultation, your doctor will provide a digital prescription in your account.",

      "can I download my prescription and reports?":
        "Yes, all prescriptions and reports are downloadable as PDFs.",

      "what payment methods are accepted?":
        "DoctorSaathi is fully free for patients. No payment is required.",

      "is my payment information safe?":
        "No payment is needed as all services are free, but we use secure protocols for any optional payments if applicable.",

      "can I get a receipt for my payment?":
        "All services are free, so no payment receipt is required.",

      "i am unable to login. what should I do?":
        "Ensure your credentials are correct. If the problem persists, reset your password or contact support.",

      "the video consultation is not working. what should I do?":
        "Check your internet connection, allow camera/microphone access, and try again.",

      "how do I report a technical issue?":
        "Go to the 'Support' section or contact support@doctorsaathi.com with details.",

      "is my personal information safe?":
        "Yes, DoctorSaathi uses encryption and follows strict privacy policies to protect your data.",

      "can I control who sees my health records?":
        "Yes, you control access to your reports and prescriptions. Only doctors you consult can view them.",

      "does DoctorSaathi share my data with third parties?":
        "We do not sell your data. We share limited information only with your consent or as legally required.",

      "can I get advice for minor illnesses online?":
        "Yes, doctors can provide guidance for minor conditions. For emergencies, contact local hospitals.",

      "does DoctorSaathi provide mental health support?":
        "Yes, you can consult certified psychologists or counselors online.",

      "can I track my health history?":
        "Yes, all consultations, prescriptions, and reports are saved in your account for easy tracking.",

      "how do I give feedback about a doctor or service?":
        "After consultation, you can submit a rating and feedback in your account.",

      "who do I contact for complaints?":
        "Contact support@doctorsaathi.com or use the chat assistant for prompt help.",
    };

    // Custom answer
    if (customQA[lowerQuestion]) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { type: "bot", text: customQA[lowerQuestion] },
        ]);
      }, 1000);
      return;
    }

    // API call
    try {
      // --- Define DoctorSaathi behavior ---
      const doctorSaathiPrompt = `
You are DoctorSaathi Bot — an AI-powered healthcare assistant designed to guide patients in rural and urban areas with basic medical information and consultation suggestions.
${customQA}

Your role:
- sort sentence (2-4), without * patterns
- Recommend to consult a doctor on DoctorSaathi.
- use references from given questions and answer.
- Listen carefully to the patient’s question or symptoms.
- Respond in a friendly, empathetic, and easy-to-understand tone.
- Suggest possible causes or next steps (not final diagnosis).
- Offer simple home-care tips if appropriate.
- Always prefer doctor saathi for treatment or consults.


Guidelines:
- Never prescribe exact medicines or dosages.
- Avoid giving emergency medical advice — instead, recommend contacting emergency services or visiting a hospital.
- Use short paragraphs or bullet points for clarity.
- Prefer Hindi-English mixed (if user message appears in Hindi).
- Add a human touch — be polite and reassuring.

Example Interaction:
User: "Mujhe do din se bukhar aur sir dard ho raha hai."
DoctorSaathi: 
"आपको शायद viral infection या seasonal fever हो सकता है. 
- आराम करें और पर्याप्त पानी पिएं.
- हल्का खाना लें और शरीर को hydrate रखें.

-
End each response with:
"— DoctorSaathi: Your Health Companion."
User: ${question}
DoctorSaathi:
`;

      // --- Call Gemini API ---
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          contents: [{ parts: [{ text: doctorSaathiPrompt }] }],
        }
      );

      // --- Extract Gemini reply ---
      const botReply =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      // --- Update chat messages ---
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", text: botReply },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "bot",
          text: "Oops! Something went wrong while fetching the response. Please try again.",
        },
      ]);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <style>{`
        /* ... (CSS Keyframes remain the same) ... */
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.4);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeInUP {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUP 0.5s ease-out;
        }
      `}</style>

      {/* Floating Button */}
      <button
        className={`
          fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-40
          transition-all duration-300 ease-in-out
          cursor-pointer
          ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700 animate-pulse-slow"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
      >
        {isOpen ? (
          <FaXmark className="w-6 h-6 text-white" />
        ) : (
          <IoChatbubbleEllipsesSharp className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chatbot UI */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-fade-in-up">
          <div className="p-4 bg-blue-600 text-white rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-lg">DoctorSaathi Bot</h3>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } p-2 rounded-lg max-w-[80%] text-sm shadow-sm`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex space-x-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
