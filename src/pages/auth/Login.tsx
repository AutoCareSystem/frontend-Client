// Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState<"customer" | "employee">("customer");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === "customer") navigate("/customer/dashboard");
    else navigate("/employee/dashboard");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-10 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Login</h1>
        <input type="text" placeholder="Email" className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"/>
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"/>
        <select className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200" onChange={(e)=>setRole(e.target.value as "customer" | "employee")}>
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>
        <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium text-white">Login</button>
      </div>
    </div>
  );
}
