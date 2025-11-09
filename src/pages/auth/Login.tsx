import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Customer" | "Employee">("Customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5093/api/auth/login", {
        email,
        password,
      });

      console.log('Login response:', res.data);
      
      // Save tokens and user info
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      
      console.log('Stored values:', {
        accessToken: localStorage.getItem("accessToken"),
        role: localStorage.getItem("role"),
        userId: localStorage.getItem("userId")
      });

      // Navigate based on backend role
      if (res.data.role === "Customer") navigate("/customer/dashboard");
      else navigate("/employee/dashboard");
    } catch (err: any) {
      console.error('Login error:', err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-10 rounded-xl shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-red-500">Login</h1>

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
            setRole(e.target.value as "Customer" | "Employee")
          }
        >
          <option value="Customer">Customer</option>
          <option value="Employee">Employee</option>
        </select>

        {error && <p className="mb-3 text-red-500">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}