import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import {
  FaStethoscope,
  FaPills,
  FaComments,
  FaCalendarAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { FaXmark, FaCheck } from "react-icons/fa6";
import {
  Heart,
  Users,
  Stethoscope,
  HeartPulse,
  Globe,
  UserPlus,
} from "lucide-react";

// --- Data Definitions ---

const IMPACT_STATS_DATA = [
  { icon: Users, value: 10000, label: "Patients Reached", display: "10K+" },
  {
    icon: Stethoscope,
    value: 500,
    label: "Doctors Onboarded",
    display: "500+",
  },
  { icon: HeartPulse, value: 95, label: "Positive Feedback", display: "95%" },
  { icon: Globe, value: 50, label: "Villages Covered", display: "50+" },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to travel two hours to see a specialist. Now, with DoctorSaathi, I connect with a trusted doctor right from my home.",
    name: "Anjali Devi",
    role: "Village resident, Bihar",
    avatar: "A",
  },
  {
    quote:
      "DoctorSaathi helped me get quick advice for my child’s fever. I didn’t have to wait in long queues at the hospital.",
    name: "Ramesh Kumar",
    role: "Farmer, Uttar Pradesh",
    avatar: "R",
  },
  {
    quote:
      "I never thought I could talk to a neurologist from my village. This app connects us with specialists we never had access to before.",
    name: "Sita Ram",
    role: "Teacher, Jharkhand",
    avatar: "S",
  },
];

const features = [
  {
    icon: <FaStethoscope className="w-10 h-10 text-emerald-600" />,
    title: "Consult Doctors Online",
    description: "Connect with specialists easily, anytime, anywhere.",
  },
  {
    icon: <FaPills className="w-10 h-10 text-emerald-600" />,
    title: "Get Prescriptions",
    description: "Digital prescriptions at your fingertips.",
  },
  {
    icon: <FaComments className="w-10 h-10 text-emerald-600" />,
    title: "Chat with Doctors",
    description: "Simple, text-based consultation with verified doctors.",
  },
  {
    icon: <FaCalendarAlt className="w-10 h-10 text-emerald-600" />,
    title: "Appointments & Reminders",
    description: "Never miss follow-ups or scheduled consultations.",
  },
];

const carouselImages = [
  {
    src: "https://images.pexels.com/photos/7195310/pexels-photo-7195310.jpeg",
    alt: "Doctor consulting patient via video call",
  },
  {
    src: "https://images.pexels.com/photos/9048742/pexels-photo-9048742.jpeg",
    alt: "Rural family using DoctorSaathi app",
  },
  {
    src: "https://images.pexels.com/photos/7465699/pexels-photo-7465699.jpeg",
    alt: "Healthcare professional helping a community",
  },
];

const CONTACT_LINKS = [
  {
    icon: <FaPhoneAlt className="w-5 h-5" />,
    label: "Call Us",
    link: "tel:+919876543210",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
  },
  {
    icon: <FaWhatsapp className="w-5 h-5" />,
    label: "WhatsApp",
    link: "https://wa.me/919876543210",
    bgColor: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
  {
    icon: <FaEnvelope className="w-5 h-5" />,
    label: "Email",
    link: "mailto:support@doctorsaathi.com",
    bgColor: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
];

// Mock Data for Doctors
const doctorsData = [
  {
    name: "Dr. Alina Mehta",
    specialty: "Cardiologist",
    image: "https://images.pexels.com/photos/7904408/pexels-photo-7904408.jpeg",
  },
  {
    name: "Dr. Arjun Mehra",
    specialty: "General Physician",
    image: "https://images.pexels.com/photos/5888143/pexels-photo-5888143.jpeg",
  },
  {
    name: "Dr. Priya Kapoor",
    specialty: "Pediatrician",
    image: "https://images.pexels.com/photos/5207098/pexels-photo-5207098.jpeg",
  },
  {
    name: "Dr. Leo Mendez",
    specialty: "Neurologist",
    image:
      "https://images.pexels.com/photos/14438788/pexels-photo-14438788.jpeg",
  },
  {
    name: "Dr. Sanya Rao",
    specialty: "Dermatologist",
    image: "https://images.pexels.com/photos/5234482/pexels-photo-5234482.jpeg",
  },
  {
    name: "Dr. Nia Sharma",
    specialty: "Gynecologist",
    image: "https://images.pexels.com/photos/5998482/pexels-photo-5998482.jpeg",
  },
  {
    name: "Dr. Ethan Ray",
    specialty: "Dentist",
    image:
      "https://images.pexels.com/photos/14628069/pexels-photo-14628069.jpeg",
  },
  {
    name: "Dr. Rex Ford",
    specialty: "Orthopedic",
    image:
      "https://images.pexels.com/photos/15962798/pexels-photo-15962798.jpeg",
  },
];

// Custom styles are included here to ensure the precise 4-card layout on desktop
const customStyles = `
    /* Custom CSS to enable smooth horizontal scrolling and hide scrollbar */
    .doctor-carousel-content {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        scroll-behavior: smooth; /* Enable smooth scrolling when using JS */
        scroll-snap-type: x mandatory; /* Helps snap to start of card group */
    }
    .doctor-carousel-content::-webkit-scrollbar {
        display: none; /* Chrome, Safari, and Opera */
    }

    /* Card sizing for responsive layout (1, 2, or 4 cards visible) */
    .doctor-card-item {
        flex: 0 0 100%; /* Default: Mobile (1 card per view) */
        scroll-snap-align: start;
        min-width: 100%;
    }

    @media (min-width: 768px) {
        .doctor-card-item {
            flex: 0 0 calc(50% - 0.75rem); /* Tablet: 2 cards per view (space-x-6 gap / 2) */
            min-width: calc(50% - 0.75rem);
        }
    }

    @media (min-width: 1024px) {
        .doctor-card-item {
            /* Desktop: 4 cards per view. Need to subtract the total gap (3 * 1.5rem = 4.5rem) divided by 4 */
            flex: 0 0 calc(25% - 1.125rem); 
            min-width: calc(25% - 1.125rem);
        }
    }
`;

// --- Sub-Components ---

// 1. Cookie Consent Banner Component (Unchanged)

const CookieConsent = ({ onAccept, onReject }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-2xl z-50 transform transition-transform duration-500 animate-slide-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-3 md:mb-0 md:mr-4">
          We use cookies to enhance your user experience and analyze site
          traffic. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded transition-colors duration-200"
          >
            <FaCheck /> Accept
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1 border border-white hover:bg-white hover:text-gray-800 text-white text-xs font-semibold py-2 px-3 rounded transition-colors duration-200"
          >
            <FaXmark /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Animated Counter Component (Unchanged)
const AnimatedCounter = ({ endValue, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
          setCount(0);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!inView || count !== 0) return;

    let start = 0;
    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [endValue, duration, inView]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// 4. Image Carousel Component (Unchanged)
const ImageCarousel = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-gray-100">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className="w-full flex-shrink-0 object-cover h-64 md:h-96"
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index
                ? "bg-blue-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// 5. Floating Contact Hub Component (Unchanged)

// --- Main Component ---

const Home = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  // Set up animation classes for sections
  const animationClass =
    "transform transition duration-1000 ease-out translate-y-0 opacity-100";
  const initialClass = "transform translate-y-10 opacity-0";

  // State to track if sections have been viewed for animation
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [featuresAnimated, setFeaturesAnimated] = useState(false);
  const [carouselAnimated, setCarouselAnimated] = useState(false);
  const [aboutAnimated, setAboutAnimated] = useState(false);
  const [doctorsAnimated, setDoctorsAnimated] = useState(false);
  const [impactAnimated, setImpactAnimated] = useState(false);
  // NEW: State for testimonial animation
  const [testimonialsAnimated, setTestimonialsAnimated] = useState(false);

  useEffect(() => {
    setHeroAnimated(true);

    const cookieConsentStatus = localStorage.getItem("cookieConsent");
    if (
      cookieConsentStatus === "accepted" ||
      cookieConsentStatus === "rejected"
    ) {
      setShowCookieConsent(false);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Logic to trigger section-fade-in animation
      const sections = [
        {
          id: "features",
          setState: setFeaturesAnimated,
          animated: featuresAnimated,
        },
        {
          id: "carousel",
          setState: setCarouselAnimated,
          animated: carouselAnimated,
        },
        { id: "about", setState: setAboutAnimated, animated: aboutAnimated },
        {
          id: "doctors",
          setState: setDoctorsAnimated,
          animated: doctorsAnimated,
        },
        {
          id: "testimonials",
          setState: setTestimonialsAnimated,
          animated: testimonialsAnimated,
        },
        { id: "impact", setState: setImpactAnimated, animated: impactAnimated },
      ];

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (
          element &&
          !section.animated &&
          scrollY + windowHeight * 0.8 > element.offsetTop
        ) {
          section.setState(true);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    featuresAnimated,
    carouselAnimated,
    aboutAnimated,
    doctorsAnimated,
    impactAnimated,
    testimonialsAnimated,
  ]);

  const handleCookieAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowCookieConsent(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowCookieConsent(false);
  };

  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Scrolls by the visible container width
    const scrollAmount = carousel.offsetWidth;
    const maxScroll = carousel.scrollWidth - carousel.offsetWidth;

    if (direction === "next") {
      // Check if we are at the end (allowing for small float errors by checking + 1)
      if (carousel.scrollLeft + 1 >= maxScroll) {
        // Wrap around to the start (smooth scroll to 0)
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollAmount;
      }
    } else {
      // 'prev' direction
      // Check if we are at the start
      if (carousel.scrollLeft <= 0) {
        // Wrap around to the end (smooth scroll to maxScroll)
        carousel.scrollLeft = maxScroll;
      } else {
        carousel.scrollLeft -= scrollAmount;
      }
    }
  };

  /**
   * Starts the automatic scrolling interval.
   */
  const startAutoScroll = () => {
    // Prevent multiple intervals from starting
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      scrollCarousel("next");
    }, 3000);
  };

  /**
   * Stops the automatic scrolling interval (used on hover/cleanup).
   */
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effect to manage auto-scrolling lifecycle
  useEffect(() => {
    // Start auto-scroll when component mounts
    startAutoScroll();

    // Cleanup function runs when component unmounts
    return () => stopAutoScroll();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- Global Animation Styles (Ideally in a CSS file) --- */}
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

      {/* ============================================================
        --- Hero Section (Already Animated) ---
        ============================================================
      */}
      <section
        className={`bg-gradient-to-br from-white via-blue-50 to-emerald-50 ${
          heroAnimated ? animationClass : initialClass
        }`}
      >
        <div className="container mx-auto md:px-30 px-10 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 animate-fade-in-down">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              DoctorSaathi –{" "}
              <TypeAnimation
                sequence={[
                  "Your Digital Doctor, Always With You.",
                  2000,
                  "Connect. Consult. Care.",
                  2000,
                  "Health Support for Everyone.",
                  2000,
                ]}
                speed={50}
                deletionSpeed={30}
                wrapper="span"
                repeat={Infinity}
                className="text-emerald-700"
              />
            </h1>

            <p className="text-gray-700 text-lg md:text-xl">
              Connect with trusted doctors anytime, anywhere. Simple,
              low-bandwidth, and rural-friendly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-right">
              <a
                href="/auth"
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-xl transition duration-300 text-center transform hover:scale-105"
              >
                Register Now
              </a>
              <a
                href="/auth"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition duration-300 text-center transform hover:translate-x-1"
              >
                Login
              </a>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fade-in">
            <img
              src="/doctor-illustration.png"
              alt="Doctor consulting villager"
              className="w-full md:w-4/5 transition duration-500 hover:rotate-1"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
        --- Features Section (Staggered Animation ADDED) ---
        ============================================================
      */}
      <section
        id="features"
        className={`mx-auto px-6 py-16 transition-all duration-1000 ${
          featuresAnimated ? animationClass : initialClass
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-down">
            Core Services for Every Home 🏠
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300 border-b-4 border-blue-400 hover:border-emerald-600 transform hover:-translate-y-1"
                style={{
                  // Staggered Fade-in and slight movement
                  transitionDelay: featuresAnimated ? `${index * 0.15}s` : "0s",
                  opacity: featuresAnimated ? 1 : 0,
                  transform: featuresAnimated
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.6s",
                }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
        --- Image Carousel Section (Already Animated) ---
        ============================================================
      */}
      <section
        id="carousel"
        className={`bg-white py-12 transition-all duration-1000 ${
          carouselAnimated ? animationClass : initialClass
        }`}
      >
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Image / Carousel */}
          <div className="w-full md:w-1/2">
            <ImageCarousel images={carouselImages} interval={3000} />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Glimpse into Accessible Healthcare
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              DoctorSaathi is built specifically for rural communities across
              India. Our platform bridges the gap between healthcare
              professionals and underserved areas, ensuring that quality medical
              guidance is just a few taps away — no matter the device or
              internet speed.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              By combining simplicity, reliability, and cutting-edge technology,
              DoctorSaathi empowers individuals to connect with verified
              doctors, access digital prescriptions, and receive preventive
              healthcare advice in their local language. We believe that every
              citizen — regardless of location — deserves timely and trustworthy
              medical support.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
        --- About / Mission Section (Already Animated) ---
        ============================================================
      */}
      <section className="bg-white py-16 md:py-24 transition-all duration-1000">
        <div className="container mx-auto max-w-7xl px-6">
          <div
            className="flex flex-col md:flex-row-reverse items-center justify-between"
            id="about"
          >
            <div className="md:w-1/2 flex justify-center mb-10 md:mb-0 transform hover:scale-105 transition duration-500">
              <div
                className={`w-96 justify-center ${
                  aboutAnimated ? animationClass : initialClass
                }`}
              >
                <img
                  src="/poster.jpg"
                  alt="Doctor Illustration"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div
              className={`md:w-1/2 text-center md:text-left ${
                aboutAnimated ? "animate-fade-in-down" : initialClass
              }`}
            >
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
                Bringing Quality Care Where It Matters Most
              </h2>
              <p className="text-lg text-gray-600">
                DoctorSaathi is built specifically for rural communities in
                India. We prioritize simplicity and reliability to ensure
                everyone can access trusted medical advice, regardless of their
                location or data speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
        --- Doctor Carousel Section (NEW) ---
        ============================================================
      */}

      <div className="bg-gray-50 font-sans min-h-screen">
        <style>{customStyles}</style>

        <section
          id="doctor-section"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
            We bring together top medical professionals dedicated to providing
            compassionate, world-class care across all specialties.
          </p>

          {/* Doctor Carousel Container - Hover events stop/start auto-scroll */}
          <div
            className="relative"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            {/* Scroll Buttons (Desktop Only) */}
            <button
              onClick={() => scrollCarousel("prev")}
              aria-label="Previous doctors"
              className="absolute top-1/2 left-0 -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl border border-gray-200 hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 hidden lg:block active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel("next")}
              aria-label="Next doctors"
              className="absolute top-1/2 right-0 -translate-y-1/2 z-10 p-4 bg-white rounded-full shadow-xl border border-gray-200 hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 hidden lg:block active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Doctor Cards Container (Scrollable Area) */}
            <div
              ref={carouselRef}
              className="doctor-carousel-content flex overflow-x-scroll space-x-6 pb-6"
            >
              {doctorsData.map((doctor, index) => (
                <div
                  key={index}
                  className="doctor-card-item relative overflow-hidden h-[400px] rounded-2xl shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100"
                  style={{
                    backgroundImage: `url(${doctor.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#ccc",
                  }}
                >
                  {/* 1. Full Detail Overlay (Hidden/Faded initially) */}
                  <Link to="/user">
                    <div
                      className="absolute inset-0 bg-indigo-900 bg-opacity-70 flex flex-col justify-end p-8 
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-lg text-indigo-200 font-semibold mb-3">
                        {doctor.specialty}
                      </p>

                      <p className="text-base text-white leading-relaxed mb-6">
                        Dr. {doctor.name.split(" ")[2] || doctor.name} is
                        dedicated to patient-centric care focusing on
                        cutting-edge research and personalized patient outcomes.
                      </p>

                      {/* Book Consultant Button */}

                      <p className="w-full inline-flex items-center justify-center py-3 px-6 text-indigo-900 bg-white rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg active:translate-y-0.5">
                        Book Consultant
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </p>
                    </div>
                  </Link>
                  {/* 2. Always Visible Bottom Bar (Subtle hint) */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                    <h3 className="text-xl font-bold text-white">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-indigo-300 font-medium">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Scroll Hint */}
            <div className="lg:hidden text-center pt-4 text-base text-gray-500 italic">
              &larr; Scroll horizontally or tap/hold to pause auto-scroll &rarr;
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
        --- New Doctors Section (Already Animated) ---
        ============================================================
      */}
      <section
        id="doctors"
        className={`bg-gradient-to-l from-emerald-50 via-white to-white py-16 md:py-24 transition-all duration-1000 ${
          doctorsAnimated ? animationClass : initialClass
        }`}
      >
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 text-center md:text-left space-y-4">
              <UserPlus className="w-12 h-12 text-blue-600 mx-auto md:mx-0" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Join Our Network of Trusted Doctors
              </h2>
              <p className="text-lg text-gray-600">
                Are you a certified medical professional passionate about
                serving underserved communities? Join DoctorSaathi and use our
                low-bandwidth platform to connect with thousands of patients
                across rural India, on your own schedule.
              </p>
              <ul className="text-left text-gray-700 space-y-2 list-disc list-inside ml-4">
                <li>Flexible remote consultations.</li>
                <li>Dedicated technical and language support.</li>
                <li>Be a part of a national health movement.</li>
              </ul>
              <a
                href="/doctor-signup"
                className="inline-block mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-md transition duration-300 transform hover:scale-105"
              >
                Apply to be a DoctorSaathi
              </a>
            </div>

            <div className="md:w-1/2 object-center object-cover flex justify-center">
              <img
                src="https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg"
                alt="Professional doctor smiling"
                className="w-full max-w-sm rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
        --- Testimonial Section (Staggered Animation ADDED) ---
        ============================================================
      */}
      <section className="bg-blue-50 py-16" id="testimonials">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-fade-in-down" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Stories of Health and Hope
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {TESTIMONIALS.map((t, index) => (
              <div
                key={index}
                className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-2xl shadow-lg border-b-4 border-emerald-500 transition duration-500 transform hover:shadow-xl hover:-translate-y-1"
                style={{
                  // Staggered Fade-in and slight movement (identical to features)
                  transitionDelay: testimonialsAnimated
                    ? `${index * 0.15}s`
                    : "0s",
                  opacity: testimonialsAnimated ? 1 : 0,
                  transform: testimonialsAnimated
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.6s",
                }}
              >
                <p className="text-sm md:text-base italic text-gray-700 mb-4 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg mr-3">
                    {t.avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
        --- Impact Section (Counter and Container Animated) ---
        ============================================================
      */}
      <section className="bg-white py-16 md:py-20" id="impact">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Growing Impact
          </h2>
          <div
            className={`grid grid-cols-2 gap-8 md:grid-cols-4 ${
              impactAnimated ? animationClass : initialClass
            }`}
          >
            {IMPACT_STATS_DATA.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 transform hover:scale-105 transition duration-300"
              >
                <stat.icon className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <p className="text-4xl font-extrabold text-blue-600 mb-1">
                  <AnimatedCounter
                    endValue={stat.value}
                    suffix={stat.label.includes("Feedback") ? "%" : "+"}
                  />
                </p>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showCookieConsent && (
        <CookieConsent
          onAccept={handleCookieAccept}
          onReject={handleCookieReject}
        />
      )}
    </div>
  );
};

export default Home;
