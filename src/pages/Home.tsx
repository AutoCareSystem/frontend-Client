import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const isLogged = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'));
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] text-gray-100">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="text-2xl font-bold text-red-400">AutoCare</div>
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Professional vehicle care, simplified.</h1>
            <p className="mt-4 text-gray-300">Book appointments, manage service packages and track projects — all in one place. Built for garages, workshops and fleets.</p>

            <div className="mt-6 flex gap-4">
              <Link to="/signup" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">Get started — Sign up</Link>
              <button onClick={() => navigate('/employee/services')} className="px-6 py-3 bg-transparent border border-gray-700 rounded text-gray-300">Explore services</button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#07121a]/50 rounded">
                <h4 className="font-semibold">Online Booking</h4>
                <p className="text-xs text-gray-400 mt-1">Allow customers to schedule appointments and reduce phone time.</p>
              </div>
              <div className="p-4 bg-[#07121a]/50 rounded">
                <h4 className="font-semibold">Service Catalog</h4>
                <p className="text-xs text-gray-400 mt-1">Create packages, set durations and prices, and sell more services.</p>
              </div>
              <div className="p-4 bg-[#07121a]/50 rounded">
                <h4 className="font-semibold">Project Tracking</h4>
                <p className="text-xs text-gray-400 mt-1">Manage larger repairs as projects with milestones and assignments.</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-gradient-to-tr from-[#08121a] to-[#0b2430] p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold text-white">Why AutoCare?</h3>
              <ul className="mt-4 text-sm text-gray-300 space-y-2">
                <li>• Reduce administrative overhead and manage appointments easily.</li>
                <li>• Centralized service catalog and pricing control.</li>
                <li>• Assign work and track progress for complex jobs.</li>
              </ul>
              <div className="mt-6 text-sm text-gray-400">Already have an account? <Link to="/login" className="text-red-400 underline">Login</Link></div>
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
