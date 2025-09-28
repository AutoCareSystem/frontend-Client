# Vehicle Service Center ERP - Frontend

A modern React-based frontend application for a Vehicle Service Center ERP system, built with TypeScript, Tailwind CSS, and React Router.

## Features

### Customer Features

- **User Authentication**: Secure login and signup with role-based access control
- **Dashboard**: Real-time service/project progress tracking with statistics
- **Vehicle Service Booking**: Multi-step booking workflow with service selection, vehicle selection, and date/time scheduling
- **Vehicle Management**: Add and manage multiple vehicles
- **Booking Management**: View and track all service appointments
- **Responsive Design**: Mobile-friendly interface that works on all devices

### Key Components

- **Authentication System**: Complete login/signup flow with form validation
- **Dashboard**: Overview of bookings, statistics, and quick actions
- **Booking Workflow**: 4-step process (Service → Vehicle → Date/Time → Review)
- **Service Selection**: Browse available services with categories and pricing
- **Vehicle Selection**: Manage and select from registered vehicles
- **Date/Time Picker**: Calendar interface with available time slots
- **Real-time Updates**: Track service progress and status changes

## Technology Stack

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict typing
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing and navigation
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation for forms and API data
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Modern JavaScript date utility library
- **Axios** - HTTP client for API communication

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Booking/         # Service booking components
│   ├── Dashboard/       # Dashboard components
│   └── Layout/          # Layout components (Header, etc.)
├── contexts/            # React contexts for state management
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # Login page
│   ├── Signup.tsx       # Registration page
│   ├── Dashboard.tsx    # Customer dashboard
│   └── BookService.tsx  # Service booking page
├── services/            # API service layer
│   └── api.ts          # HTTP client and API endpoints
├── types/               # TypeScript type definitions
│   └── index.ts        # All application types and interfaces
└── App.tsx             # Main application component with routing
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on http://localhost:5093

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is designed to work with a .NET backend API. The API service layer (`src/services/api.ts`) handles all HTTP communication with the following endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Vehicles

- `GET /api/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Services

- `GET /api/services` - Get available services
- `GET /api/services/:id` - Get service details

### Bookings

- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/available-slots` - Get available time slots

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Key Features Implementation

### 1. Authentication System

- JWT token-based authentication
- Role-based access control (Customer/Employee/Admin)
- Protected routes with automatic redirects
- Form validation with Zod schemas
- Password visibility toggle
- Remember me functionality

### 2. Service Booking Workflow

- **Step 1**: Service selection with categories and pricing
- **Step 2**: Vehicle selection from registered vehicles
- **Step 3**: Date and time selection with calendar interface
- **Step 4**: Review and confirmation with booking details
- Progress indicator with step validation
- Real-time form validation and error handling

### 3. Dashboard Features

- Statistics cards (total bookings, upcoming appointments, etc.)
- Recent bookings list with status indicators
- Quick action buttons for common tasks
- Responsive grid layout
- Loading states and error handling

### 4. Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly interface elements
- Collapsible navigation for mobile
- Optimized for all screen sizes

## State Management

The application uses React Context for global state management:

- **AuthContext**: Handles authentication state, user data, and auth methods
- **Local State**: Component-level state for forms and UI interactions
- **API State**: Server state managed through API service layer

## Form Validation

All forms use React Hook Form with Zod validation:

- **Login Form**: Email and password validation
- **Signup Form**: Complete user registration with password confirmation
- **Booking Form**: Multi-step form with conditional validation
- **Real-time validation** with user-friendly error messages

## Styling and UI

- **Tailwind CSS** for utility-first styling
- **Custom components** with consistent design system
- **Responsive design** with mobile-first approach
- **Accessibility features** with proper ARIA labels and keyboard navigation
- **Loading states** and skeleton screens for better UX
- **Error handling** with user-friendly error messages

## Development Guidelines

### Code Style

- Use TypeScript for all components
- Prefer functional components with hooks
- Use descriptive variable and function names
- Follow React best practices and patterns
- Use early returns for better readability

### Component Structure

- Keep components small and focused
- Use proper TypeScript interfaces
- Implement proper error boundaries
- Use loading states for async operations

### API Integration

- Use the centralized API service
- Handle errors gracefully
- Implement proper loading states
- Use TypeScript for API responses

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Chatbot integration for service inquiries
- [ ] File upload for vehicle documents
- [ ] Advanced filtering and search
- [ ] PWA capabilities for mobile app experience
- [ ] Dark mode theme support
- [ ] Internationalization (i18n) support

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test on multiple screen sizes
5. Update documentation for new features

## License

This project is part of the EAD (Enterprise Application Development) assignment.
