import { useEffect, useState } from "react";
import "./App.css";

// define what the API response looks like
interface ApiResponse {
  message: string;
}

export default function App() {
  // explicitly type the state as a string
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("http://localhost:5093/test");
        const data: ApiResponse = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error("Error fetching API:", err);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        React + ASP.NET Test
      </h1>

      <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-md">
        API says: {message || "Loading..."}
      </div>
    </div>
  );
}
