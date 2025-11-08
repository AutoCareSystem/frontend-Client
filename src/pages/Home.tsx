import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero-car.png';

export default function Home() {
  const navigate = useNavigate();
  const isLogged = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'));
  // role intentionally not used in this layout

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04101a] to-[#071824] text-gray-100">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div className="text-2xl font-bold text-red-400 tracking-tight">AutoCare</div>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-300 hover:text-white">Home</Link>
          <Link to="/employee/services" className="text-sm text-gray-300 hover:text-white">Services</Link>
          <Link to="/employee/projects" className="text-sm text-gray-300 hover:text-white">Projects</Link>
          {isLogged ? (
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-sm bg-red-600 px-3 py-1 rounded">Logout</button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-sm bg-red-600 px-3 py-1 rounded">Sign up</Link>
            </div>
          )}
        </nav>
      </header>

      <main className="mx-auto px-6 py-12">
        {/* Hero - full bleed feel inside max container */}
  <section className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch gap-10">
          {/* decorative blob */}
          <div className="hidden lg:block absolute -left-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#06323a] to-[#043046] opacity-60 blur-3xl transform rotate-12" />

          <div className="z-10 px-4 py-8 lg:py-0 flex flex-col justify-center min-h-[560px] lg:col-span-7">
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Professional vehicle care,<br/>simplified for modern workshops.</h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl">Book appointments, manage service packages, and track projects — all from a single streamlined dashboard built for garages and fleets.</p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold shadow-xl">Get started — Sign up</Link>
              <button onClick={() => navigate('/employee/services')} className="px-6 py-3 bg-transparent border border-gray-700 rounded-md text-gray-300">Explore services</button>
            </div>

            <div className="mt-8 -ml-2 sm:-ml-0 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard title="Online Booking" desc="Let customers book in seconds."> 
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8h18M7 4v4M17 4v4M21 10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </FeatureCard>
              <FeatureCard title="Service Catalog" desc="Create packages and prices.">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7h18v13H3zM7 7V4h10v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </FeatureCard>
              <FeatureCard title="Project Tracking" desc="Milestones, assignments & notes.">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </FeatureCard>
            </div>
          </div>

          <div className="z-10 flex items-center justify-center px-4 lg:col-span-5">
            <div className="relative w-full max-w-4xl lg:translate-x-6">
              <img src={heroImg} alt="hero" className="w-full h-auto max-h-[680px] object-contain rounded-3xl border border-gray-800 shadow-2xl"/>
              <div className="absolute -bottom-8 left-6 bg-[#07121a]/85 p-3 rounded-xl border border-gray-800 flex items-center gap-3 backdrop-blur">
            
                <div className="text-sm">
                  <div className="font-semibold">Fast & Modern</div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 bg-[#07121a]/40 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold">How it works</h3>
          <ol className="mt-3 text-sm text-gray-300 list-decimal list-inside space-y-2">
            <li>Create your service catalog and packages.</li>
            <li>Accept bookings and assign technicians.</li>
            <li>Track projects, invoices and completion status.</li>
          </ol>
        </section>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-sm text-gray-500">© {new Date().getFullYear()} AutoCare — Built for workshops</footer>
    </div>
  );
}

function FeatureCard({ title, desc, children }: { title: string; desc: string; children: any }) {
  return (
    <div className="p-4 bg-[#07121a]/50 rounded flex flex-col items-start gap-3">
      <div className="p-2 bg-[#081827] rounded inline-flex items-center justify-center">{children}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
}
