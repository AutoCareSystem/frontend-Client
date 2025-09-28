import axios, { type AxiosInstance } from "axios";
import type {
  User,
  Vehicle,
  Service,
  Booking,
  Project,
  TimeLog,
  StatusUpdate,
  AvailableSlots,
  DashboardStats,
  Notification,
  ApiResponse,
  LoginForm,
  SignupForm,
  VehicleForm,
  BookingForm,
  ProjectForm,
} from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5093/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
 async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
  const response = await this.api.post("/auth/login", credentials);
  if (response.data && response.data.accessToken) {
    const user = {
      id: response.data.id || "",
      email: credentials.email,
      firstName: response.data.firstName || "",
      lastName: response.data.lastName || "",
      phone: response.data.phoneNumber || "", 
      role: response.data.role || "User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { success: true, data: { user, token: response.data.accessToken } };
  }
  throw new Error(response.data.message || "Login failed");
}

  async signup(userData: SignupForm): Promise<ApiResponse<{ user: User; token: string }>> {
  const response = await this.api.post("/auth/register", {
    email: userData.email,
    password: userData.password,
    role: "User",
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phone 
  });
  if (response.data && response.data.accessToken) {
    const user = {
      id: response.data.id || "",
      email: userData.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      phone: response.data.phoneNumber,
      role: response.data.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { success: true, data: { user, token: response.data.accessToken } };
  } else {
    throw new Error(response.data.message || "Signup failed");
  }
}

  async logout(): Promise<void> {
    await this.api.post("/auth/logout");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get("/auth/me");
    return response.data;
  }

  // Vehicle endpoints
  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    const response = await this.api.get("/vehicles");
    return response.data;
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    const response = await this.api.get(`/vehicles/${id}`);
    return response.data;
  }

  async createVehicle(vehicle: VehicleForm): Promise<ApiResponse<Vehicle>> {
    const response = await this.api.post("/vehicles", vehicle);
    return response.data;
  }

  async updateVehicle(
    id: string,
    vehicle: Partial<VehicleForm>
  ): Promise<ApiResponse<Vehicle>> {
    const response = await this.api.put(`/vehicles/${id}`, vehicle);
    return response.data;
  }

  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/vehicles/${id}`);
    return response.data;
  }

  // Service endpoints
  async getServices(): Promise<ApiResponse<Service[]>> {
    const response = await this.api.get("/services");
    return response.data;
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    const response = await this.api.get(`/services/${id}`);
    return response.data;
  }

  // Booking endpoints
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await this.api.get("/bookings");
    return response.data;
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async createBooking(booking: BookingForm): Promise<ApiResponse<Booking>> {
    const response = await this.api.post("/bookings", booking);
    return response.data;
  }

  async updateBooking(
    id: string,
    booking: Partial<BookingForm>
  ): Promise<ApiResponse<Booking>> {
    const response = await this.api.put(`/bookings/${id}`, booking);
    return response.data;
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await this.api.patch(`/bookings/${id}/cancel`);
    return response.data;
  }

  // Available slots endpoint
  async getAvailableSlots(
    date: string,
    serviceId: string
  ): Promise<ApiResponse<AvailableSlots>> {
    const response = await this.api.get(
      `/bookings/available-slots?date=${date}&serviceId=${serviceId}`
    );
    return response.data;
  }

  // Project endpoints
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.api.get("/projects");
    return response.data;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(project: ProjectForm): Promise<ApiResponse<Project>> {
    const response = await this.api.post("/projects", project);
    return response.data;
  }

  async updateProject(
    id: string,
    project: Partial<ProjectForm>
  ): Promise<ApiResponse<Project>> {
    const response = await this.api.put(`/projects/${id}`, project);
    return response.data;
  }

  // Status update endpoints
  async getStatusUpdates(
    bookingId?: string,
    projectId?: string
  ): Promise<ApiResponse<StatusUpdate[]>> {
    const params = new URLSearchParams();
    if (bookingId) params.append("bookingId", bookingId);
    if (projectId) params.append("projectId", projectId);

    const response = await this.api.get(`/status-updates?${params.toString()}`);
    return response.data;
  }

  async createStatusUpdate(
    update: Omit<StatusUpdate, "id" | "timestamp">
  ): Promise<ApiResponse<StatusUpdate>> {
    const response = await this.api.post("/status-updates", update);
    return response.data;
  }

  // Time logging endpoints
  async getTimeLogs(
    bookingId?: string,
    projectId?: string
  ): Promise<ApiResponse<TimeLog[]>> {
    const params = new URLSearchParams();
    if (bookingId) params.append("bookingId", bookingId);
    if (projectId) params.append("projectId", projectId);

    const response = await this.api.get(`/time-logs?${params.toString()}`);
    return response.data;
  }

  async createTimeLog(
    timeLog: Omit<TimeLog, "id" | "createdAt">
  ): Promise<ApiResponse<TimeLog>> {
    const response = await this.api.post("/time-logs", timeLog);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await this.api.get("/dashboard/stats");
    return response.data;
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const response = await this.api.get("/notifications");
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.patch(`/notifications/${id}/read`);
    return response.data;
  }

  // Chatbot endpoints
  async sendChatMessage(
    message: string
  ): Promise<ApiResponse<{ response: string }>> {
    const response = await this.api.post("/chatbot/message", { message });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
