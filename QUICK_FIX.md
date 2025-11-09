# 🚨 Quick Fix Script for CORS + Customer ID Issues

## Problem Summary

1. **CORS Error**: Backend needs to be restarted with new CORS configuration
2. **Wrong Customer ID**: Dashboard is using "1" instead of the correct GUID
3. **404 Errors**: Customer "1" doesn't exist in your database

## 🔧 Step-by-Step Fix

### Step 1: Fix Customer ID in Browser

Open browser console (`F12`) and run:

```javascript
// Clear incorrect customer ID
localStorage.removeItem("customerId");
localStorage.removeItem("customerID");

// Set correct customer ID
localStorage.setItem("customerId", "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a");

// Verify it's set correctly
console.log("Customer ID:", localStorage.getItem("customerId"));
```

### Step 2: Stop All Backend Processes

```powershell
# Stop any running dotnet processes
Get-Process -Name "backend" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# Alternative: Use Ctrl+C in each terminal running the backend
```

### Step 3: Restart Authentication Service

```powershell
# Open new terminal/PowerShell window
cd "C:\Users\LENOVO\OneDrive\Desktop\EAD\AutoService-Backend\Authentication_Service"
dotnet run --project backend.csproj
```

### Step 4: Restart Service Management Service

```powershell
# Open another new terminal/PowerShell window
cd "C:\Users\LENOVO\OneDrive\Desktop\EAD\AutoService-Backend\Service_Management_Service"
dotnet run
```

### Step 5: Refresh Dashboard

1. Go to your dashboard: `http://localhost:5174/customer/dashboard`
2. Press `Ctrl+F5` (hard refresh)
3. Check browser console - should see API calls succeeding

## ✅ Expected Results After Fix

You should see in browser console:

```
🔄 Fetching dashboard data for customer: f003b7d9-eefe-4cb6-8f87-06ff62c54d8a
✅ Profile loaded: {userName: "...", email: "...", ...}
✅ Vehicles loaded: [...]
✅ Services loaded: [...]
```

## 🐛 Alternative: Test with Different Customer ID

If customer `f003b7d9-eefe-4cb6-8f87-06ff62c54d8a` doesn't exist in your database, find a valid one:

### Option A: Check your database

```sql
SELECT "Id", "UserName", "Email" FROM "AspNetUsers"
WHERE "Id" IN (SELECT "UserID" FROM "Customers")
LIMIT 5;
```

### Option B: Use API to find customers

```bash
# Test if Authentication service is running
curl http://localhost:5292/api/health

# Get all customers (if endpoint exists)
curl http://localhost:5292/api/Customers
```

### Option C: Create test data

If no customers exist, you can:

1. Register a new customer through your signup endpoint
2. Use the registration endpoint to create test data
3. Insert test data directly into your database

## 🎯 Quick Test Commands

After restarting backends, test each endpoint:

```bash
# Test customer endpoint
curl "http://localhost:5292/api/Customers/f003b7d9-eefe-4cb6-8f87-06ff62c54d8a"

# Test vehicles endpoint
curl "http://localhost:5292/api/Vehicles/customer/f003b7d9-eefe-4cb6-8f87-06ff62c54d8a"

# Test services endpoint
curl "http://localhost:5292/api/Services"
```

## 🎉 Success Indicators

When everything works:

- ✅ No CORS errors in browser console
- ✅ API calls return 200 OK (not 404)
- ✅ Dashboard shows real customer data
- ✅ Vehicle information displays
- ✅ Service history appears
- ✅ Available services are listed

The main issue is that the backend services need to be restarted with the new CORS configuration, and the correct customer ID needs to be set in localStorage.
