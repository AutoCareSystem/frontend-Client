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

// Mock data
const mockUser: User = {
  id: "dev-user-1",
  email: "dev@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "123-456-7890",
  role: "customer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    customerId: "dev-user-1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    vin: "1HGBH41JXMN109186",
    licensePlate: "ABC-123",
    color: "Silver",
    mileage: 45000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "vehicle-2",
    customerId: "dev-user-1",
    make: "Honda",
    model: "Civic",
    year: 2019,
    vin: "2HGBH41JXMN109187",
    licensePlate: "XYZ-789",
    color: "Blue",
    mileage: 52000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Oil Change",
    description: "Complete oil change service with filter replacement",
    duration: 30,
    price: 29.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-2",
    name: "Brake Service",
    description: "Brake pad replacement and brake fluid check",
    duration: 120,
    price: 149.99,
    category: "repair",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-3",
    name: "Engine Tune-up",
    description: "Complete engine inspection and tune-up",
    duration: 180,
    price: 199.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-4",
    name: "Tire Rotation",
    description: "Tire rotation and pressure check",
    duration: 45,
    price: 39.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "dev-user-1",
    vehicleId: "vehicle-1",
    serviceId: "service-1",
    appointmentDate: "2024-01-15",
    appointmentTime: "10:00",
    status: "confirmed",
    notes: "Regular maintenance",
    estimatedDuration: 30,
    totalCost: 29.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: mockUser,
    vehicle: mockVehicles[0],
    service: mockServices[0],
  },
  {
    id: "booking-2",
    customerId: "dev-user-1",
    vehicleId: "vehicle-2",
    serviceId: "service-2",
    appointmentDate: "2024-01-20",
    appointmentTime: "14:00",
    status: "pending",
    notes: "Brake pads making noise",
    estimatedDuration: 120,
    totalCost: 149.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: mockUser,
    vehicle: mockVehicles[1],
    service: mockServices[1],
  },
];

const mockDashboardStats: DashboardStats = {
  totalBookings: 5,
  upcomingAppointments: 2,
  completedServices: 3,
  totalSpent: 450.0,
  activeProjects: 1,
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API responses
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

const createErrorResponse = (message: string): ApiResponse => ({
  success: false,
  error: message,
});

class MockApiService {
  // Authentication endpoints
  async login(
    credentials: LoginForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log("Mock API: Login", credentials);
    await delay(1000);
    return createSuccessResponse({
      user: mockUser,
      token: "mock-jwt-token-123",
    });
  }

  async signup(
    userData: SignupForm
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log("Mock API: Signup", userData);
    await delay(1000);
    return createSuccessResponse({
      user: mockUser,
      token: "mock-jwt-token-123",
    });
  }

  async logout(): Promise<void> {
    console.log("Mock API: Logout");
    await delay(500);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    console.log("Mock API: Get Current User");
    await delay(500);
    return createSuccessResponse(mockUser);
  }

  // Vehicle endpoints
  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    console.log("Mock API: Get Vehicles");
    await delay(500);
    return createSuccessResponse(mockVehicles);
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    console.log("Mock API: Get Vehicle", id);
    await delay(500);
    const vehicle = mockVehicles.find((v) => v.id === id);
    if (!vehicle) {
      return createErrorResponse("Vehicle not found");
    }
    return createSuccessResponse(vehicle);
  }

  async createVehicle(vehicle: VehicleForm): Promise<ApiResponse<Vehicle>> {
    console.log("Mock API: Create Vehicle", vehicle);
    await delay(1000);
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      customerId: mockUser.id,
      ...vehicle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockVehicles.push(newVehicle);
    return createSuccessResponse(newVehicle);
  }

  async updateVehicle(
    id: string,
    vehicle: Partial<VehicleForm>
  ): Promise<ApiResponse<Vehicle>> {
    console.log("Mock API: Update Vehicle", id, vehicle);
    await delay(1000);
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      return createErrorResponse("Vehicle not found");
    }
    mockVehicles[index] = {
      ...mockVehicles[index],
      ...vehicle,
      updatedAt: new Date().toISOString(),
    };
    return createSuccessResponse(mockVehicles[index]);
  }

  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    console.log("Mock API: Delete Vehicle", id);
    await delay(1000);
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      return createErrorResponse("Vehicle not found");
    }
    mockVehicles.splice(index, 1);
    return createSuccessResponse(undefined);
  }

  // Service endpoints
  async getServices(): Promise<ApiResponse<Service[]>> {
    console.log("Mock API: Get Services");
    await delay(500);
    return createSuccessResponse(mockServices);
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    console.log("Mock API: Get Service", id);
    await delay(500);
    const service = mockServices.find((s) => s.id === id);
    if (!service) {
      return createErrorResponse("Service not found");
    }
    return createSuccessResponse(service);
  }

  // Booking endpoints
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    console.log("Mock API: Get Bookings");
    await delay(500);
    return createSuccessResponse(mockBookings);
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    console.log("Mock API: Get Booking", id);
    await delay(500);
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) {
      return createErrorResponse("Booking not found");
    }
    return createSuccessResponse(booking);
  }

  async createBooking(booking: BookingForm): Promise<ApiResponse<Booking>> {
    console.log("Mock API: Create Booking", booking);
    await delay(1000);
    const service = mockServices.find((s) => s.id === booking.serviceId);
    const vehicle = mockVehicles.find((v) => v.id === booking.vehicleId);

    if (!service || !vehicle) {
      return createErrorResponse("Service or vehicle not found");
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      customerId: mockUser.id,
      ...booking,
      status: "pending",
      estimatedDuration: service.duration,
      totalCost: service.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: mockUser,
      vehicle,
      service,
    };

    mockBookings.push(newBooking);
    return createSuccessResponse(newBooking);
  }

  async updateBooking(
    id: string,
    booking: Partial<BookingForm>
  ): Promise<ApiResponse<Booking>> {
    console.log("Mock API: Update Booking", id, booking);
    await delay(1000);
    const index = mockBookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return createErrorResponse("Booking not found");
    }
    mockBookings[index] = {
      ...mockBookings[index],
      ...booking,
      updatedAt: new Date().toISOString(),
    };
    return createSuccessResponse(mockBookings[index]);
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    console.log("Mock API: Cancel Booking", id);
    await delay(1000);
    const index = mockBookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return createErrorResponse("Booking not found");
    }
    mockBookings[index].status = "cancelled";
    mockBookings[index].updatedAt = new Date().toISOString();
    return createSuccessResponse(mockBookings[index]);
  }

  // Available slots endpoint
  async getAvailableSlots(
    date: string,
    serviceId: string
  ): Promise<ApiResponse<AvailableSlots>> {
    console.log("Mock API: Get Available Slots", date, serviceId);
    await delay(500);
    const mockSlots: TimeSlot[] = [
      { time: "09:00", isAvailable: true },
      { time: "10:00", isAvailable: true },
      { time: "11:00", isAvailable: false },
      { time: "12:00", isAvailable: true },
      { time: "13:00", isAvailable: true },
      { time: "14:00", isAvailable: false },
      { time: "15:00", isAvailable: true },
      { time: "16:00", isAvailable: true },
      { time: "17:00", isAvailable: true },
    ];

    return createSuccessResponse({
      date,
      slots: mockSlots,
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    console.log("Mock API: Get Dashboard Stats");
    await delay(500);
    return createSuccessResponse(mockDashboardStats);
  }

  // Project endpoints (stubs)
  async getProjects(): Promise<ApiResponse<Project[]>> {
    console.log("Mock API: Get Projects");
    await delay(500);
    return createSuccessResponse([]);
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    console.log("Mock API: Get Project", id);
    await delay(500);
    return createErrorResponse("Project not found");
  }

  async createProject(project: ProjectForm): Promise<ApiResponse<Project>> {
    console.log("Mock API: Create Project", project);
    await delay(1000);
    return createErrorResponse("Not implemented");
  }

  async updateProject(
    id: string,
    project: Partial<ProjectForm>
  ): Promise<ApiResponse<Project>> {
    console.log("Mock API: Update Project", id, project);
    await delay(1000);
    return createErrorResponse("Not implemented");
  }

  // Status update endpoints (stubs)
  async getStatusUpdates(
    bookingId?: string,
    projectId?: string
  ): Promise<ApiResponse<StatusUpdate[]>> {
    console.log("Mock API: Get Status Updates", bookingId, projectId);
    await delay(500);
    return createSuccessResponse([]);
  }

  async createStatusUpdate(
    update: Omit<StatusUpdate, "id" | "timestamp">
  ): Promise<ApiResponse<StatusUpdate>> {
    console.log("Mock API: Create Status Update", update);
    await delay(1000);
    return createErrorResponse("Not implemented");
  }

  // Time logging endpoints (stubs)
  async getTimeLogs(
    bookingId?: string,
    projectId?: string
  ): Promise<ApiResponse<TimeLog[]>> {
    console.log("Mock API: Get Time Logs", bookingId, projectId);
    await delay(500);
    return createSuccessResponse([]);
  }

  async createTimeLog(
    timeLog: Omit<TimeLog, "id" | "createdAt">
  ): Promise<ApiResponse<TimeLog>> {
    console.log("Mock API: Create Time Log", timeLog);
    await delay(1000);
    return createErrorResponse("Not implemented");
  }

  // Notification endpoints (stubs)
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    console.log("Mock API: Get Notifications");
    await delay(500);
    return createSuccessResponse([]);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    console.log("Mock API: Mark Notification as Read", id);
    await delay(500);
    return createSuccessResponse(undefined);
  }

  // Chatbot endpoints (stubs)
  async sendChatMessage(
    message: string
  ): Promise<ApiResponse<{ response: string }>> {
    console.log("Mock API: Send Chat Message", message);
    await delay(1000);
    return createSuccessResponse({
      response:
        "This is a mock response from the chatbot. The actual chatbot integration is not implemented yet.",
    });
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
