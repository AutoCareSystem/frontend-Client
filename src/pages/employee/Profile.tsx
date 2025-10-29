import Sidebar from "../../components/Sidebar";

export default function Profile() {
  const employee = { name: "Jane Doe", email: "jane@company.com", role: "Employee" };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Profile</h1>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 max-w-md">
          <p className="mb-2"><strong>Name:</strong> {employee.name}</p>
          <p className="mb-2"><strong>Email:</strong> {employee.email}</p>
          <p className="mb-2"><strong>Role:</strong> {employee.role}</p>
          <button className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">Edit Profile</button>
        </div>
      </main>
    </div>
  );
}
