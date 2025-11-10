import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function Modifications() {
  const mods = [
    { name: "Seat Upgrade", status: "Pending" },
    { name: "Custom Paint", status: "In Progress" },
  ];

  const [completionDate, setCompletionDate] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  // const requestModification = () => {
  //   setTouched(true);
  //   if (!completionDate) {
  //     alert('Please enter a desired completion date before requesting a modification');
  //     return;
  //   }

  //   alert(`Modification requested. Desired completion: ${completionDate}`);
  //   // reset
  //   setCompletionDate(undefined);
  //   setTouched(false);
  // };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Customer"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Vehicle Modifications</h1>
        <ul className="space-y-4">
          {mods.map((mod, idx) => (
            <li key={idx} className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700 flex justify-between">
              <span>{mod.name}</span>
              <span className="text-gray-400">{mod.status}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 p-6 bg-[#2a2a2a] rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Request a Modification</h2>
          <label className="block mb-2 text-sm text-gray-300">Desired completion date (required)</label>
          <input
            type="date"
            value={completionDate || ''}
            onChange={(e) => setCompletionDate(e.target.value || undefined)}
            className="w-full px-3 py-2 rounded border bg-[#1a1a1a] text-gray-200 border-gray-600 mb-3"
          />
          {touched && !completionDate && (
            <p className="text-sm text-red-400 mb-3">Completion date is required.</p>
          )}
          <div className="flex items-center gap-3">
            {/* <button onClick={requestModification} className="px-4 py-2 bg-red-600 rounded text-white font-semibold">Request Modification</button> */}
            <button onClick={() => { setCompletionDate(undefined); setTouched(false); }} className="px-4 py-2 bg-gray-700 rounded text-gray-200">Reset</button>
          </div>
        </div>
      </main>
    </div>
  );
}
