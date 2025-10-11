import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";


const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState("");

  // DoctorSaathi FAQ Data
  const faqs = [
    {
      q: "What is DoctorSaathi?",
      a: "DoctorSaathi is a trusted healthcare platform that connects patients with verified doctors for online consultations, appointments, and medical services.",
    },
    {
      q: "How can I book an appointment with a doctor?",
      a: "Simply search for a doctor, select your preferred time slot, and confirm the booking. You’ll receive a confirmation via SMS or email.",
    },
    {
      q: "Can I consult a doctor online?",
      a: "Yes, you can book online video or chat consultations directly through DoctorSaathi from the comfort of your home.",
    },
    {
      q: "Is my health data safe on DoctorSaathi?",
      a: "Absolutely. We use end-to-end encryption to ensure your medical information is private and secure.",
    },
    {
      q: "How can doctors register on DoctorSaathi?",
      a: "Doctors can click 'Join as Doctor', complete the verification form, and get approved after credential review.",
    },
    {
      q: "Can I upload my prescriptions and reports?",
      a: "Yes. You can securely upload reports and prescriptions to share them with your consulting doctor.",
    },
    {
      q: "How do I reset my password?",
      a: "Click ‘Forgot Password’ on the login page and follow the reset link sent to your registered email or mobile.",
    },
    {
      q: "Does DoctorSaathi provide emergency medical services?",
      a: "DoctorSaathi is for scheduled consultations. For emergencies, please contact your local hospital or emergency helpline.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI, debit/credit cards, and digital wallets via secure payment gateways.",
    },
    {
      q: "Can I cancel or reschedule my appointment?",
      a: "Yes, you can cancel or reschedule through your account before the appointment time based on the doctor’s policy.",
    },
    {
      q: "How can I contact DoctorSaathi support?",
      a: "You can email team.servana@gmail.com or reach us via the Contact page for assistance.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white py-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Support & FAQs
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Find answers to common questions below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search questions (e.g., appointment, password)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center text-left p-5 md:p-6 focus:outline-none"
                >
                  <h3 className="text-lg md:text-xl font-medium text-gray-900">
                    {item.q}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-2xl font-bold text-sky-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 md:px-6 pb-5 md:pb-6 text-gray-700 border-t border-gray-100"
                    >
                      <p className="leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h4 className="text-xl font-semibold mb-1">Need more help?</h4>
            <p className="text-white/90">
              Our team is here to assist you with any technical or support
              queries.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/contact"
              className="bg-white text-blue-600 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Contact Support
            </a>
            <a
              href="mailto:team.servana@gmail.com"
              className="border border-white px-5 py-2 rounded-full font-medium hover:bg-white/10 transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
