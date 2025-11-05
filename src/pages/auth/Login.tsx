import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "employee">("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5093/api/auth/login", {
        email,
        password,
      });

      // Save tokens
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      // Navigate based on backend role
      if (res.data.role === "customer") navigate("/customer/dashboard");
      else navigate("/employee/dashboard");
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-10 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Login</h1>

        <input
          type="text"
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
          className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "customer" | "employee")
          }
        >
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}