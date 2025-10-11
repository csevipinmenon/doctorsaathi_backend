import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Simple Indian validation
  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{3,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit number starting 6–9

    if (!nameRegex.test(formData.name)) {
      alert("Please enter a valid name (letters only).");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (formData.subject.trim().length < 3) {
      alert("Subject must be at least 3 characters long.");
      return false;
    }
    if (formData.message.trim().length < 10) {
      alert("Message must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  // Handle submit with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/enquiry`,
        formData
      );
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset form after success
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-200 to-blue-200 text-purple-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg md:text-xl text-gray-800">
            We'd love to hear from you. Send us a message!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">team.servana@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 72096 58250</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">AGC Amritsar, Punjab</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl shadow-xl overflow-hidden h-64 md:h-80">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="bg-white text-purple-400 bg-opacity-20 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    We're Here to Help
                  </h3>
                  <p className="text-purple-100">
                    Available 24/7 for your inquiries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Message Sent!
                </h3>
                <p className="text-gray-600 text-center">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="10-digit Indian mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
