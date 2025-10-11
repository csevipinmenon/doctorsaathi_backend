import React from "react";
import { Globe, Heart, Shield, Users, Laptop, Star } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Varsha Rani",
    image:
      "https://media.licdn.com/dms/image/v2/D4E35AQEP0FhyPR84iA/profile-framedphoto-shrink_800_800/B4EZm1kxjbKUAg-/0/1759687940594?e=1760626800&v=beta&t=voDxxA52cGf10gkjxlTeAhpNwIbkHVy1PrfNTYViV9A",
    bio: "Our mission is to make healthcare accessible, reliable, and convenient for every patient.",
    linkedin: "https://www.linkedin.com/in/varsha-rani-82226a366/",
  },
  {
    name: "Vipin Kumar",
    image: "https://avatars.githubusercontent.com/u/166358641?v=4",
    bio: "We connect patients with trusted doctors and provide a seamless online consultation experience.",
    linkedin: "https://www.linkedin.com/in/vipin-kumar-04581431a/",
  },
  {
    name: "Priyaranjan",
    image: "https://avatars.githubusercontent.com/u/183178893?v=4",
    bio: "Patient privacy and data security are our top priorities in everything we do.",
    linkedin: "https://www.linkedin.com/in/csepriyaranjan/",
  },
  {
    name: "Saroj Kumar",
    role: "Coder & Developer",
    image: "https://avatars.githubusercontent.com/u/200264803?v=4",
    bio: "Innovation and empathy guide us to deliver healthcare solutions that truly make a difference.",
    linkedin: "https://www.linkedin.com/in/saroj-kumar-051a16338/",
  },
  {
    name: "Saurabh Paswan",
    role: "Marketing Lead",
    image: "https://avatars.githubusercontent.com/u/187754515?v=4",
    bio: "Connecting DoctorSaathi to patients & partners everywhere.",
    linkedin: "http://linkedin.com/in/csesaurabhpaswan/",
  },
];

export default function About() {
  return (
    <div className="text-gray-800">
      {/* Hero / Banner */}
      <div className="relative bg-blue-100 text-white py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500 opacity-60"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">About Us </h1>
          <p className="text-lg md:text-xl">
            Bridging the gap between healthcare and people through technology,
            empathy, and trust.
          </p>
        </div>
      </div>

      {/* Mission / Values */}
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Our Mission & Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <Globe className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Accessibility</h3>
            <p>
              We aim to make quality healthcare accessible for everyone,
              everywhere.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Heart className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Compassion</h3>
            <p>
              We treat every user, patient or doctor with care, respect, and
              empathy.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Trust & Security</h3>
            <p>
              Your data, health are safe. We uphold strong privacy and security
              standards.
            </p>
          </div>
        </div>
      </div>

      {/* How We Help Patients */}
      <motion.div
        className="bg-white py-16 px-6 md:px-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">
          How We Help Patients Online
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Laptop className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Book Appointments</h3>
            <p>
              Search for doctors by specialty and book online consultations
              within minutes.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Shield className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Secure Consultations</h3>
            <p>
              All consultations are encrypted, ensuring privacy and
              confidentiality of your health data.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Heart className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Health Guidance</h3>
            <p>
              Access reliable medical advice, prescriptions, and health tips
              from verified doctors.
            </p>
          </div>
        </div>
      </motion.div>

      {/* How Doctors Connect */}
      <motion.div
        className="bg-gray-50 py-16 px-6 md:px-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">
          How Doctors Connect & Partner
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Users className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Join Our Network</h3>
            <p>
              Doctors can register and join DoctorSaathi to reach patients
              online and grow their practice.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Shield className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Verified & Trusted</h3>
            <p>
              All doctors are verified and follow strict standards ensuring
              patient safety and trust.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Laptop className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Manage Appointments</h3>
            <p>
              Doctors can schedule, manage, and conduct consultations easily
              through our platform.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Patient Reviews */}
      <motion.div
        className="bg-white py-16 px-6 md:px-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">
          Patient Reviews
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-700 italic">
              "DoctorSaathi made booking my appointment so easy. I consulted a
              doctor online within minutes!"
            </p>
            <p className="mt-3 font-semibold text-gray-900"> Aarti Singh</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-700 italic">
              "The platform is secure and easy to use. I trust my health records
              are safe here."
            </p>
            <p className="mt-3 font-semibold text-gray-900">Rohit Kumar</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-700 italic">
              "Doctors are professional and patient-friendly. Highly recommend
              DoctorSaathi."
            </p>
            <p className="mt-3 font-semibold text-gray-900"> Priya Verma</p>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Meet Our Dev Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 p-6 flex flex-col items-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-blue-100"
              />
              <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
              <p className="text-gray-600 text-center text-sm">{member.bio}</p>
              <Link
                to={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-900 mb-2 flex items-center text-3xl mt-4 gap-2"
              >
                <FaLinkedin />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action / Footer Hint */}
      <div className="py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold mb-4">Join Us on Our Journey</h3>
        <p className="mb-6">
          We’re building DoctorSaathi to reshape healthcare. Let’s do it
          together.
        </p>
        <a
          href="/contact"
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
