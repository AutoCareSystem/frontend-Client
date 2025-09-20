# Development Mode - Viewing Individual Pages

This guide shows you how to view individual pages without going through the authentication workflow.

## Method 1: Development Routes (Recommended)

The easiest way is to use the development routes that bypass authentication:

### Available Development Routes:

- **Development Home**: `http://localhost:5173/dev` (Main development page with navigation)
- **Dashboard**: `http://localhost:5173/dev/dashboard`
- **Book Service**: `http://localhost:5173/dev/book-service`

### How to Use:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate directly to any development route:
   - Dashboard: `http://localhost:5173/dev/dashboard`
   - Book Service: `http://localhost:5173/dev/book-service`

These routes will show a yellow warning banner indicating they're in development mode and bypass authentication.

## Method 2: Mock Authentication Mode

For a more complete development experience with mock authentication:

1. Start the mock development server:

   ```bash
   npm run dev:mock
   ```

2. Navigate to any route:
   - Dashboard: `http://localhost:5173/dashboard`
   - Book Service: `http://localhost:5173/book-service`
   - Login: `http://localhost:5173/login`
   - Signup: `http://localhost:5173/signup`

In this mode:

- All routes are accessible without authentication
- Mock user data is provided
- Forms will log to console instead of making real API calls
- No backend API is required

## Method 3: Browser Developer Tools

You can also bypass authentication by:

1. Opening browser developer tools (F12)
2. Going to the Application/Storage tab
3. In Local Storage, add:

   - Key: `authToken`
   - Value: `mock-token-123`
   - Key: `user`
   - Value: `{"id":"1","email":"test@example.com","firstName":"Test","lastName":"User","phone":"123-456-7890","role":"customer","createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"}`

4. Refresh the page

## Development Features

### Mock Data

The development mode includes:

- Mock user authentication
- Sample dashboard statistics
- Mock service and vehicle data
- Simulated API responses

### API Simulation

All API calls are mocked and will:

- Log to the browser console
- Return sample data
- Simulate network delays
- Show loading states

### No Backend Required

Development mode works completely offline - no .NET backend needed for frontend development and testing.

## Troubleshooting

If you encounter issues:

1. **Clear browser cache**: Hard refresh (Ctrl+F5)
2. **Check console**: Look for any JavaScript errors
3. **Restart dev server**: Stop and run `npm run dev` again
4. **Check routes**: Make sure you're using the correct URLs

## Production vs Development

- **Production mode** (`npm run dev`): Full authentication, requires backend API
- **Development mode** (`npm run dev:mock`): Mock authentication, no backend required
- **Dev routes** (`/dev/*`): Bypass authentication for specific pages

5.

bypassed routes for the dev purpose
$ start http://localhost:5173/dev/test

bypass routes for booking service
$ start http://localhost:5173/dev/book-service

bypass routes for the dashboard
$ start http://localhost:5173/dev/dashboard
