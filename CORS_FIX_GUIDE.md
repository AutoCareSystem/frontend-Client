# 🚨 CORS Fix Instructions

## The Problem

Your dashboard is working perfectly, but **CORS (Cross-Origin Resource Sharing)** is blocking the API calls because:

- Frontend runs on: `http://localhost:5174`
- Backend runs on: `http://localhost:5292`
- Backend CORS policy only allowed: `http://localhost:5173`

## ✅ I've Already Fixed The Code

I've updated both backend services to allow your frontend port:

### Files Updated:

1. **`Authentication_Service/Program.cs`** - Added CORS for ports 5173, 5174, 3000
2. **`Service_Management_Service/Program.cs`** - Added CORS configuration
3. **`frontend-Client/.env`** - Set correct API URL (5292)

## 🔧 Quick Fix Steps

### 1. Stop All Running Services

```powershell
# Stop any running dotnet processes
Get-Process -Name "backend" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Restart Authentication Service

```powershell
cd "C:\Users\LENOVO\OneDrive\Desktop\EAD\AutoService-Backend\Authentication_Service"
dotnet run
```

### 3. Restart Service Management Service (New Terminal)

```powershell
cd "C:\Users\LENOVO\OneDrive\Desktop\EAD\AutoService-Backend\Service_Management_Service"
dotnet run
```

### 4. Refresh Your Browser

- Go to: `http://localhost:5174/customer/dashboard`
- Press `Ctrl+F5` to hard refresh
- Open browser console to see if CORS errors are gone

## 🎯 Expected Result

After restarting the backend services, you should see:

- ✅ API calls succeeding (no CORS errors)
- ✅ Real customer data loading
- ✅ Vehicle information displaying
- ✅ Service history showing
- ✅ Available services listed

## 🐛 If Still Not Working

### Check Backend is Running:

```powershell
# Test Authentication Service
curl http://localhost:5292/api/health

# Test if specific endpoint works
curl http://localhost:5292/api/Customers/f003b7d9-eefe-4cb6-8f87-06ff62c54d8a
```

### Check Customer ID:

Open browser console and run:

```javascript
// Check what customer ID is being used
console.log(localStorage.getItem("customerId"));
console.log(localStorage.getItem("customerID"));

// Set the correct customer ID if needed
localStorage.setItem("customerId", "f003b7d9-eefe-4cb6-8f87-06ff62c54d8a");
```

### Check Database:

Make sure your test customer exists in the database:

- Customer ID: `f003b7d9-eefe-4cb6-8f87-06ff62c54d8a`
- Or use a different customer ID that exists in your database

## 📝 What I Changed

### Authentication Service CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});
```

### Service Management Service CORS:

```csharp
// Added CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Added CORS middleware
app.UseCors("AllowReact");
```

### Frontend Environment:

```bash
VITE_API_URL=http://localhost:5292
VITE_CUSTOMER_ID=f003b7d9-eefe-4cb6-8f87-06ff62c54d8a
```

## 🚀 After Fix

Your dashboard will display:

- **Real customer profile** (name, email, phone, loyalty points)
- **Actual vehicles** with spending/service statistics
- **Service history** from your database
- **Available services** from your catalog
- **Calculated totals** and metrics

The dashboard is fully functional - it just needs the CORS issue resolved!
