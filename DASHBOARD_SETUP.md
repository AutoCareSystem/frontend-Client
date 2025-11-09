# Customer Dashboard Setup & Testing Guide

## ✅ What's Been Created

I've successfully created a complete customer dashboard that fetches real data from your backend APIs:

### 📁 New Files Created:

1. **`src/pages/customer/CleanDashboard.tsx`** - Main dashboard component
2. **`src/utils/customerAPI.ts`** - API utility functions and type definitions
3. **`.env.example`** - Environment configuration template

### 🔧 Modified Files:

1. **`src/App.tsx`** - Updated routing to use the new dashboard

## 🚀 Features Implemented

### 📊 Dashboard Sections:

1. **Header** - Personalized welcome with customer name and loyalty points
2. **Overview Stats** - Total spent, vehicles, completed/pending services
3. **Customer Profile** - Personal information with edit capability
4. **Vehicle Portfolio** - All registered vehicles with individual stats
5. **Recent Services** - Latest service history across all vehicles
6. **Available Services** - Active services from the catalog

### 🔗 API Integration:

- ✅ `GET /api/Customers/{customerID}` - Customer profile
- ✅ `GET /api/Vehicles/customer/{customerID}` - Customer vehicles
- ✅ `GET /api/Appointments/customer/{customerID}/vehicle/{vehicleID}/summary` - Vehicle stats
- ✅ `GET /api/Appointments/customer/{customerID}/vehicle/{vehicleID}/history` - Service history
- ✅ `GET /api/Services` - Available services

## 🎯 Testing Instructions

### 1. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env file and set your API URL
VITE_API_URL=http://localhost:5000
VITE_CUSTOMER_ID=f003b7d9-eefe-4cb6-8f87-06ff62c54d8a
```

### 2. Set Customer ID in localStorage

Open browser console and run:

```javascript
localStorage.setItem("customerId", "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a");
// or
localStorage.setItem("customerID", "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a");
```

### 3. Start the Application

```bash
npm run dev
```

### 4. Navigate to Dashboard

- Go to: `http://localhost:5174/customer/dashboard` (or whatever port Vite assigns)
- The dashboard will automatically fetch real data from your backend

## 🔍 What You'll See

### If Backend is Running & Data Exists:

- ✅ Real customer profile information
- ✅ Actual vehicle data with stats
- ✅ Service history from appointments
- ✅ Available services from catalog
- ✅ Calculated totals and counts

### If Backend is Not Running:

- ❌ Error message with retry button
- 🔄 Loading states while attempting to fetch

### If No Data Exists:

- 📝 Empty states with helpful messages
- ➕ Action buttons to add data

## 🛠️ How It Works

### Data Flow:

1. **Page Load** → Get customer ID from localStorage/env
2. **Fetch Profile** → Load customer basic info
3. **Fetch Vehicles** → Get all customer vehicles
4. **For Each Vehicle** → Get summary stats and service history
5. **Fetch Services** → Load available service catalog
6. **Render Dashboard** → Display all data with loading/error states

### API Functions:

- `customerAPI.getProfile(customerId)` - Customer details
- `customerAPI.getVehicles(customerId)` - Vehicle list
- `customerAPI.getVehicleSummary(customerId, vehicleId)` - Vehicle stats
- `customerAPI.getServiceHistory(customerId, vehicleId)` - Service history
- `customerAPI.getServices()` - Available services

### Utilities:

- `utils.getCustomerId()` - Get customer ID with fallbacks
- `utils.formatCurrency(amount)` - Format money values
- `utils.formatDate(dateString)` - Format dates nicely
- `utils.getStatusColor(status)` - Get status badge colors

## 🎨 UI Features

### Interactive Elements:

- 🔄 **Refresh Button** - Reload all data
- 📱 **Responsive Design** - Works on mobile/desktop
- 🎯 **Hover Effects** - Interactive cards and buttons
- 🚦 **Status Badges** - Color-coded service statuses
- 📊 **Progress Indicators** - Loading and completion states

### Visual Highlights:

- 💳 **Financial Stats** - Total spending with currency formatting
- 🚗 **Vehicle Cards** - Individual vehicle performance
- 📈 **Service Metrics** - Completed vs pending counts
- ⭐ **Loyalty Points** - Gamification element
- 🎨 **Dark Theme** - Modern automotive styling

## 🐛 Troubleshooting

### No Data Showing?

1. Check browser console for API errors
2. Verify backend is running on correct port
3. Confirm customer ID exists in database
4. Check CORS settings on backend

### API Errors?

1. Verify API endpoints are accessible
2. Check authentication if required
3. Confirm data exists for test customer
4. Review backend logs for errors

### Frontend Errors?

1. Check browser console for JavaScript errors
2. Verify all imports are working
3. Clear localStorage and refresh
4. Restart development server

## 📝 Next Steps

You can now:

1. **Test with Real Data** - Use your existing backend
2. **Customize Styling** - Modify colors/layout as needed
3. **Add Features** - Implement booking, editing, etc.
4. **Handle Authentication** - Add login/logout functionality
5. **Optimize Performance** - Add caching, pagination, etc.

The dashboard is fully functional and ready to display real data from your backend endpoints!
