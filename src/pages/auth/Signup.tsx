import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Customer" | "Employee">("Customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setSubmitting(true);
    try {
      const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
      await axios.post(`${base}/api/auth/register`, {
        email,
        password,
        role,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setError("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      // Try to surface useful server error information
      let msg = "Registration failed. Try again.";
      if (err?.response) {
        const data = err.response.data;
        if (data) {
          if (typeof data === "string") msg = data;
          else if (data.errors) {
            // ASP.NET Identity returns errors object
            try {
              const values = Object.values(data.errors).flat();
              msg = values.join("; ");
            } catch {
              msg = JSON.stringify(data.errors);
            }
          } else if (data.title || data.detail) {
            msg = `${data.title || "Error"}${data.detail ? ": " + data.detail : ""}`;
          } else {
            msg = JSON.stringify(data).slice(0, 1000);
          }
        } else {
          msg = err.response.statusText || msg;
        }
      } else if (err?.message) msg = err.message;

      setError(msg);
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-10 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "Customer" | "Employee")}
          className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"
        >
          <option value="Customer">Customer</option>
          <option value="Employee">Employee</option>
        </select>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <button
          onClick={handleSignup}
          disabled={submitting}
          className={`w-full py-2 rounded-lg font-medium text-white ${submitting ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {submitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
