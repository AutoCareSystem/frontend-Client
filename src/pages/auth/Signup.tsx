// Signup.tsx
export default function Signup() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-10 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Sign Up</h1>
        <input type="text" placeholder="Name" className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"/>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"/>
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200"/>
        <select className="w-full p-2 mb-4 rounded bg-[#1a1a1a] text-gray-200">
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>
        <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium text-white">Sign Up</button>
      </div>
    </div>
  );
}
