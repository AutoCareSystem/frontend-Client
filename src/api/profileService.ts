import { apiClient } from "./config";
import {
  CustomerProfile,
  UpdateProfileRequest,
  UpdateVehicleRequest,
} from "../types/profile.types";

class ProfileService {
  // Get customer profile
  async getProfile(userId: number): Promise<CustomerProfile> {
    const response = await apiClient.get(`/api/Profile/customer/${userId}`);
    return response.data;
  }

  // Update profile info
  async updateProfile(
    userId: number,
    data: UpdateProfileRequest
  ): Promise<void> {
    await apiClient.put(`/api/Profile/customer/${userId}`, data);
  }

  // Update vehicle
  async updateVehicle(
    userId: number,
    data: UpdateVehicleRequest
  ): Promise<void> {
    await apiClient.put(`/api/Profile/customer/${userId}/vehicle`, data);
  }

  // Get loyalty points
  async getLoyaltyPoints(userId: number): Promise<{ loyaltyPoints: number }> {
    const response = await apiClient.get(`/api/Profile/customer/${userId}/loyalty`);
    return response.data;
  }
}

export const profileService = new ProfileService();