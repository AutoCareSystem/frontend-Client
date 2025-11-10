// import Sidebar from "../../components/Sidebar";
// import { useState } from "react";
// import { createService, type ServiceDto } from "../../api/services";
// import { useNavigate } from "react-router-dom";

// export default function AddService() {
//   const [code, setCode] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [duration, setDuration] = useState<number | undefined>(60);
//   const [price, setPrice] = useState<number | undefined>(0);
//   const [status, setStatus] = useState<string>("Active");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const payload: ServiceDto = {
//         code: code || undefined,
//         title: title || undefined,
//         description: description || undefined,
//         duration: duration ?? 0,
//         price: price ?? 0,
//         status: status,
//       };
//       await createService(payload);
//       // navigate back to services list after create
//       navigate("/employee/services");
//     } catch (err: any) {
//       setError(err?.message || "Failed to create service");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
//       <Sidebar role="Employee" />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <h1 className="text-3xl font-bold text-red-500 mb-6">Add Service</h1>

//         <form onSubmit={onSubmit} className="max-w-2xl bg-[#121212] p-6 rounded-lg border border-gray-700">
//           {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

//           <label className="block text-sm text-gray-300 mb-1">Code</label>
//           <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mb-4 p-2 rounded bg-[#2a2a2a]" />

//           <label className="block text-sm text-gray-300 mb-1">Title *</label>
//           <input value={title} required onChange={(e) => setTitle(e.target.value)} className="w-full mb-4 p-2 rounded bg-[#2a2a2a]" />

//           <label className="block text-sm text-gray-300 mb-1">Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-4 p-2 rounded bg-[#2a2a2a]" rows={4} />

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
//               <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-2 rounded bg-[#2a2a2a]" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Price</label>
//               <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-2 rounded bg-[#2a2a2a]" />
//             </div>
//           </div>

//           <label className="block text-sm text-gray-300 mb-1 mt-4">Status</label>
//           <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40 p-2 rounded bg-[#2a2a2a]">
//             <option>Active</option>
//             <option>Inactive</option>
//           </select>

//           <div className="mt-6 flex gap-3">
//             <button disabled={loading} type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
//             <button type="button" onClick={() => navigate('/employee/services')} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">Cancel</button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// }
