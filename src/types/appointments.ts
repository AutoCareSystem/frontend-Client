// // Types that mirror the backend appointment/project DTO shape (partial)
// export type UserDto = {
//   userID?: number;
//   name?: string;
//   email?: string;
//   phone?: string;
// };

// export type CustomerDto = {
//   userID?: number;
//   user?: UserDto | null;
//   loyaltyPoints?: number;
//   address?: string;
// };

// export type ProjectDetailsDto = {
//   appointmentID?: number;
//   projectTitle?: string;
//   projectDescription?: string | null;
// };

// export type AppointmentDto = {
//   appointmentID?: number;
//   customerID?: number;
//   customer?: CustomerDto | null;
//   vehicleID?: number;
//   startDate?: string | null;
//   endDate?: string | null;
//   status?: string | null;
//   appointmentType?: string | null;
//   projectDetails?: ProjectDetailsDto | null;
//   // other fields omitted for brevity
// };
