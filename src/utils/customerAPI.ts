// API utility functions for customer dashboard
const AUTH_API_URL = "http://localhost:5093"; // Authentication Service (Customers, Vehicles, Employees)
const SERVICE_API_URL = "http://localhost:5292"; // Service Management (Appointments, Services)

// Type definitions
export interface CustomerProfile {
  userID: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  loyaltyPoints: number;
  address?: string;
}

export interface Vehicle {
  vehicleID: number;
  model: string;
  year: string;
  vin: string;
  plateNumber: string;
  company?: string;
}

export interface VehicleSummary {
  totalVehicles: number;
  totalSpent: number;
  completedCount: number;
  pendingCount: number;
}

export interface ServiceHistoryItem {
  title: string;
  status: string;
  price: number;
  endDateDisplay: string;
}

export interface Service {
  serviceID: number;
  code: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  status: string;
}

export interface Project {
  appointmentID: number;
  customerID: string;
  vehicleID: number;
  vehicle: {
    vehicleID: number;
    company: string;
    model: string;
    year: string;
    plateNumber: string;
  } | null;
  projectTitle: string;
  projectDescription: string;
  status: string;
  startDate: string;
  endDate: string | null;
  time: string;
  assignedEmployee: string;
}

// API functions
export const customerAPI = {
  // Get customer profile
  getProfile: async (customerId: string): Promise<CustomerProfile | null> => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/api/Customers/${customerId}`
      );
      if (response.ok) {
        return await response.json();
      }
      console.warn("Failed to fetch customer profile:", response.status);
      return null;
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      return null;
    }
  },

  // Get customer vehicles
  getVehicles: async (customerId: string): Promise<Vehicle[]> => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/api/Vehicles/customer/${customerId}`
      );
      if (response.ok) {
        return await response.json();
      }
      console.warn("Failed to fetch vehicles:", response.status);
      return [];
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
  },

  // Get vehicle summary
  getVehicleSummary: async (
    customerId: string,
    vehicleId: number
  ): Promise<VehicleSummary | null> => {
    try {
      const response = await fetch(
        `${SERVICE_API_URL}/api/Appointments/customer/${customerId}/vehicle/${vehicleId}/summary`
      );
      if (response.ok) {
        return await response.json();
      }
      console.warn(
        `Failed to fetch summary for vehicle ${vehicleId}:`,
        response.status
      );
      return null;
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId} summary:`, error);
      return null;
    }
  },

  // Get vehicle service history
  getServiceHistory: async (
    customerId: string,
    vehicleId: number
  ): Promise<ServiceHistoryItem[]> => {
    try {
      const response = await fetch(
        `${SERVICE_API_URL}/api/Appointments/customer/${customerId}/vehicle/${vehicleId}/history`
      );
      if (response.ok) {
        return await response.json();
      }
      console.warn(
        `Failed to fetch history for vehicle ${vehicleId}:`,
        response.status
      );
      return [];
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId} history:`, error);
      return [];
    }
  },

  // Get available services
  getServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${SERVICE_API_URL}/api/Services`);
      if (response.ok) {
        const services = await response.json();
        return services.filter(
          (service: Service) => service.status === "Active"
        );
      }
      console.warn("Failed to fetch services:", response.status);
      return [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  // Get customer projects
  getProjects: async (customerId: string): Promise<Project[]> => {
    try {
      const response = await fetch(
        `${SERVICE_API_URL}/api/Projects/customer/${customerId}`
      );
      if (response.ok) {
        return await response.json();
      }
      console.warn("Failed to fetch projects:", response.status);
      return [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  // Update customer profile
  updateProfile: async (
    customerId: string,
    updateData: {
      userName?: string;
      phoneNumber?: string;
      address?: string;
    }
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${AUTH_API_URL}/api/Customers/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error updating customer profile:", error);
      return false;
    }
  },
};

// Utility functions
export const utils = {
  // Get customer ID from localStorage with fallbacks
  getCustomerId: (): string => {
    // Check all possible localStorage keys
    const storedId =
      localStorage.getItem("customerId") || localStorage.getItem("customerID");

    // List of known invalid/test customer IDs to automatically clear
    const invalidIds = [
      "1",
      "2",
      "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a",
      "f870c055-3687-4b2c-8f96-dd4ce73dc654",
    ];

    // If stored ID is invalid, clear it and use fallback
    if (storedId && invalidIds.includes(storedId)) {
      console.log(`Clearing invalid customer ID: ${storedId}`);
      localStorage.removeItem("customerId");
      localStorage.removeItem("customerID");
      const fallbackId = "60ac7690-236e-4a55-8ace-ccc3e456cfc0"; // samasha@gmail.com
      console.log(`Using fallback customer ID: ${fallbackId}`);
      return fallbackId;
    }

    const customerId =
      storedId ||
      import.meta.env.VITE_CUSTOMER_ID ||
      "60ac7690-236e-4a55-8ace-ccc3e456cfc0"; // samasha@gmail.com

    console.log(`Customer ID resolved: ${customerId}`);
    return customerId;
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  // Get status color class
  getStatusColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
      case "approved":
        return "bg-yellow-500/20 text-yellow-400";
      case "in progress":
        return "bg-blue-500/20 text-blue-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  },
};
