import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "employee">("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5093/api/auth/register", {
        email,
        password,
        role,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setError("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError("Registration failed. Try again.");
      setSuccess("");
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
          onChange={(e) => setRole(e.target.value as "customer" | "employee")}
          className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"
        >
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium text-white"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
