import React from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  UserCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 px-6 md:px-20 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          Privacy & Policy
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
          At <span className="font-semibold text-blue-600">Doctor</span>
          <span className="text-emerald-600 font-semibold">Saathi</span>, we
          value your trust. This Privacy Policy outlines how we handle your data
          to ensure your safety, confidentiality, and transparency.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto space-y-10">
        {/* 1️⃣ Data Collection */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              1. Information We Collect
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We collect information that you provide when using DoctorSaathi’s
            services, such as your name, contact details, and health-related
            preferences. Some data may also be collected automatically like
            browser type, IP address, and usage patterns for analytics purposes.
          </p>
        </section>

        {/* 2️⃣ Data Usage */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              2. How We Use Your Data
            </h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To improve our services and patient support.</li>
            <li>To send appointment reminders and healthcare updates.</li>
            <li>To personalize your experience within our platform.</li>
            <li>
              To ensure compliance with legal and regulatory requirements.
            </li>
          </ul>
        </section>

        {/* 3️⃣ Data Security */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              3. Data Protection & Security
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Your privacy is our top priority. We use advanced encryption,
            two-factor authentication, and secure cloud storage to protect your
            data from unauthorized access. Our team follows strict security
            protocols to maintain confidentiality at all times.
          </p>
        </section>

        {/* 4️⃣ Sharing Policy */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-orange-500 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Sharing of Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            DoctorSaathi does not sell or rent your personal data. We may share
            limited information with verified healthcare partners, government
            bodies, or service providers — but only with your consent or when
            required by law.
          </p>
        </section>

        {/* 5️⃣ User Control */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-pink-500 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Your Rights & Choices
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You can review, update, or delete your information at any time by
            contacting our support team. You also have the right to withdraw
            consent for data usage or request data export for your records.
          </p>
        </section>

        {/* 6️⃣ Contact Info */}
        <section className="bg-white shadow-lg rounded-2xl p-8 border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions or concerns about our Privacy Policy, feel
            free to contact us:
          </p>
          <ul className="mt-4 space-y-1 text-gray-700">
            <li>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 inline" />
                <span> Email: </span>
              </div>
              <a
                href="mailto:team.servana@gmail.com"
                className="text-blue-600 hover:underline"
              >
                team.servana@gmail.com
              </a>
            </li>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              <span>+917209658250</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>AGC , Amritsar, Punjab</span>
            </div>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-sm text-gray-500">
        Last Updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </div>
    </div>
  );
}
