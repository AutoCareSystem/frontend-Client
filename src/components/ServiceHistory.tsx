import { MoreVertical, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  status: string;
  date: string;
  location?: string;
  cost: string;
}

interface Appointment {
  id: number;
  appointmentID?: number;
  serviceName?: string;
  status: string;
  cost?: number;
  totalPrice?: number;
  createdDate?: string;
  startDate?: string;
  completedDate?: string;
  appointmentType?: string;
}

export default function ServiceHistory() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Get customer ID from .env (priority) or localStorage
  // Force use of .env values for real data
  const customerId = import.meta.env.VITE_CUSTOMER_ID || localStorage.getItem("customerId") || "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a";

  // Fetch real service history from API
  useEffect(() => {
    const fetchServiceHistory = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5292";

        console.log("📋 Fetching service history for customer:", customerId);

        const response = await fetch(
          `${apiUrl}/api/Appointments/customer/${customerId}`
        );

        if (response.ok) {
          const appointments: Appointment[] = await response.json();
          console.log("✅ Service history data received:", appointments);

          // Transform appointments to services
          const transformedServices: Service[] = appointments
            .filter((apt) => apt.appointmentType !== "Project") // Only services
            .map((apt) => ({
              id: (apt.appointmentID || apt.id || 0).toString(),
              name: apt.serviceName || "Service",
              status: (apt.status || "Pending").toLowerCase().replace(" ", "-"),
              date: apt.createdDate || apt.startDate || new Date().toISOString().split("T")[0],
              location: "Service Center",
              cost: `$${apt.totalPrice || apt.cost || 0}`,
            }))
            .slice(0, 4); // Show last 4 services

          setServices(transformedServices);
        } else {
          console.warn("⚠️ Service history API error:", response.status);
        }
      } catch (err) {
        console.error("❌ Service history fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, [customerId]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
      "in-progress": { bg: "bg-blue-500/10", text: "text-blue-500" },
      completed: { bg: "bg-green-500/10", text: "text-green-500" },
    };
    const style = statusMap[status] || { bg: "bg-gray-500/10", text: "text-gray-500" };
    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-bold text-white">Service History</h3>
        <button className="text-gray-400 hover:text-white transition">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="divide-y divide-gray-700/50">
        {loading ? (
          <div className="p-6 text-center text-gray-400">
            <p>Loading service history...</p>
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 hover:bg-[#333333]/50 transition group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-2 group-hover:text-gray-200 transition">
                  {service.name}
                </h4>
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    {service.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-500" />
                    {service.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                {getStatusBadge(service.status)}
                <span className="text-sm font-bold text-red-500">
                  {service.cost}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-400">
            <p>No services found</p>
          </div>
        )}
      </div>

      <button className="w-full p-3 text-center border-t border-gray-700/50 text-gray-400 hover:text-white hover:bg-[#333333]/30 transition font-medium text-sm">
        View All Services
      </button>
    </div>
  );
}
