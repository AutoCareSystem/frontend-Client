import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import heroImg from "../assets/hero-car.png";

export default function Home() {
  const navigate = useNavigate();
  const isLogged =
    typeof window !== "undefined" && Boolean(localStorage.getItem("accessToken"));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030b14] via-[#061623] to-[#0a2135] text-gray-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-extrabold text-red-500 tracking-tight">
            AutoCare
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/employee/services">Services</NavLink>
          <NavLink to="/employee/projects">Projects</NavLink>

          {isLogged ? (
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-sm bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-red-600 px-4 py-2 rounded-full font-medium hover:bg-red-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto px-6 py-20 max-w-7xl">
        <section className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-16">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-sky-600/10 blur-3xl rounded-full" />

          <motion.div
            className="z-10 lg:col-span-7 flex flex-col justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              Premium Vehicle Care,{" "}
              <span className="text-red-500">Redefined</span>.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed">
              Simplify your auto workshop — manage services, bookings, and
              projects in one smart dashboard designed for modern garages.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold shadow-lg shadow-red-900/20 transition"
              >
                Get Started
              </Link>
              <button
                onClick={() => navigate("/employee/services")}
                className="px-8 py-4 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-800/40 transition"
              >
                Explore Services
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <FeatureCard
                title="Online Booking"
                desc="Customers can book appointments in seconds."
              >
                <CalendarIcon />
              </FeatureCard>
              <FeatureCard
                title="Service Catalog"
                desc="Customize service packages and pricing."
              >
                <PackageIcon />
              </FeatureCard>
              <FeatureCard
                title="Project Tracking"
                desc="Track milestones and technician assignments."
              >
                <ListIcon />
              </FeatureCard>
            </div>
          </motion.div>

          <motion.div
            className="z-10 flex items-center justify-center lg:col-span-5"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full max-w-xl">
              <img
                src={heroImg}
                alt="Hero"
                className="w-full h-auto object-contain rounded-3xl border border-gray-800 shadow-2xl shadow-black/50"
              />
              <div className="absolute -bottom-6 left-6 bg-[#0d1722]/80 p-4 rounded-xl border border-gray-700 backdrop-blur-lg">
                <div className="text-sm font-semibold text-gray-200">
                  🚗 Fast. Reliable. Modern.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-white mb-4">About AutoCare</h2>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            AutoCare is built to revolutionize how garages and fleet managers
            handle their daily operations. From booking and billing to project
            tracking and customer communication — everything is integrated into
            a single modern system designed for speed and simplicity.
          </p>
        </section>

        {/* How it works */}
        <section className="mt-20 bg-[#081520]/60 p-8 rounded-2xl border border-gray-800 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">
            How AutoCare Works
          </h3>
          <ol className="text-gray-300 list-decimal list-inside space-y-2 text-base">
            <li>Set up your service catalog and pricing easily.</li>
            <li>Customers book their preferred service times online.</li>
            <li>Assign jobs, track status, and complete with confidence.</li>
            <li>Access analytics to monitor performance and customer trends.</li>
          </ol>
        </section>

        {/* Testimonials */}
        <section className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-10">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Ravi Kumar"
              role="Garage Owner"
              quote="AutoCare transformed my business — I now handle bookings and invoices 3x faster!"
            />
            <TestimonialCard
              name="Nadeesha Perera"
              role="Fleet Manager"
              quote="I love how simple it is to assign tasks and monitor project completion."
            />
            <TestimonialCard
              name="Ishan Fernando"
              role="Technician"
              quote="The dashboard is beautiful, fast, and helps me focus on actual work, not paperwork."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 bg-gradient-to-r from-red-600 to-red-700 p-12 rounded-3xl text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Ready to modernize your garage?</h3>
          <p className="text-lg mb-8">
            Join AutoCare today and experience smarter, faster, and more reliable vehicle care.
          </p>
          <Link
            to="/signup"
            className="px-10 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-gray-200 transition"
          >
            Get Started for Free
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-[#07121c] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-2xl font-bold text-red-500 mb-3">AutoCare</h4>
            <p className="text-sm text-gray-400">
              Smart solutions for modern workshops — automate bookings,
              management, and customer satisfaction.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-3 text-gray-200">Quick Links</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/employee/services">Services</Link></li>
              <li><Link to="/employee/projects">Projects</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-3 text-gray-200">Contact</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Mail size={16}/> support@autocare.com</li>
              <li className="flex items-center gap-2"><Phone size={16}/> +94 77 456 7890</li>
              <li className="flex items-center gap-2"><MapPin size={16}/> Colombo, Sri Lanka</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-3 text-gray-200">Follow Us</h5>
            <div className="flex gap-4 text-gray-400">
              <Facebook className="hover:text-white cursor-pointer" />
              <Twitter className="hover:text-white cursor-pointer" />
              <Instagram className="hover:text-white cursor-pointer" />
              <Linkedin className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} AutoCare — All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------ */
/* Reusable Components                  */
/* ------------------------------------ */
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative text-sm text-gray-300 hover:text-white transition group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-500 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function FeatureCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="p-6 bg-[#0a1a2c]/70 rounded-2xl border border-gray-700 flex flex-col gap-3 hover:bg-[#0d2238]/90 transition group"
      whileHover={{ scale: 1.05 }}
    >
      <div className="p-3 bg-red-600/10 rounded-xl text-red-400 group-hover:text-red-300 transition">
        {children}
      </div>
      <div className="font-semibold text-white">{title}</div>
      <div className="text-sm text-gray-400">{desc}</div>
    </motion.div>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#0c1b2e]/70 border border-gray-700 rounded-2xl p-6 shadow-md text-left"
    >
      <p className="text-gray-300 italic mb-4">“{quote}”</p>
      <div className="font-semibold text-white">{name}</div>
      <div className="text-sm text-gray-400">{role}</div>
    </motion.div>
  );
}

/* ------------------------------------ */
/* Simple Icons (SVGs)                  */
/* ------------------------------------ */
const CalendarIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8h18M7 4v4M17 4v4M21 10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"
    />
  </svg>
);

const PackageIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18v13H3zM7 7V4h10v3"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
