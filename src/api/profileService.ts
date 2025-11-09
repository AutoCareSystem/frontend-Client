import { apiClient } from "./config";
import type {
  CustomerProfile,
  UpdateProfileRequest,
  UpdateVehicleRequest,
} from "../types/profile.types";

class ProfileService {
  // Get customer profile
  async getProfile(userId: number): Promise<CustomerProfile> {
    try {
      console.log('Fetching profile for userId:', userId);
      const response = await apiClient.get(`/api/Profile/customer/${userId}`);
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', {
        status: error.response?.status,
        data: error.response?.data,
        error: error.message
      });
      throw error;
    }
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