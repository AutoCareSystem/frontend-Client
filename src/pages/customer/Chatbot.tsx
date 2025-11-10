import Sidebar from "../../components/Sidebar";

export default function Chatbot() {
  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Customer"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Chatbot</h1>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 max-w-lg">
          <p className="text-gray-400 mb-4">Ask about available service slots:</p>
          <input type="text" placeholder="Type your query..." className="w-full mb-4 p-2 rounded bg-[#1a1a1a] text-gray-200"/>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">Send</button>
        </div>
      </main>
    </div>
  );
}
