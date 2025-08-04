# DriveConnect - Car Service Platform

A simple and responsive car service booking platform with client, service provider, and admin dashboards.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **User Authentication**: Login and registration with role-based access
- **Three User Roles**:
  - **Client**: Book car services, view bookings, manage profile
  - **Service Provider**: Manage bookings, view earnings, handle services
  - **Admin**: Monitor platform, manage users, view analytics
- **Real-time Updates**: Live dashboard statistics and notifications
- **Modern UI**: Beautiful design with consistent color theme

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Main site: http://localhost:3000
   - Login: http://localhost:3000/login
   - Register: http://localhost:3000/register
   - Client Dashboard: http://localhost:3000/client-dashboard
   - Provider Dashboard: http://localhost:3000/provider-dashboard
   - Admin Dashboard: http://localhost:3000/admin-dashboard

## Demo Accounts

### Client Account
- Email: `client@example.com`
- Password: `password`

### Service Provider Account
- Email: `provider@example.com`
- Password: `password`

### Admin Account
- Email: `admin@example.com`
- Password: `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/dashboard/stats` - Get dashboard statistics

### Bookings
- `GET /api/client/bookings` - Get client bookings
- `GET /api/provider/bookings` - Get provider bookings
- `GET /api/admin/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/status` - Update booking status

### Admin
- `GET /api/admin/users` - Get all users (admin only)

## Project Structure

```
driveconnect/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── index.html             # Home page
├── login.html             # Login page
├── register.html          # Registration page
├── client-dashboard.html  # Client dashboard
├── provider-dashboard.html # Service provider dashboard
├── admin-dashboard.html   # Admin dashboard
├── assets/               # Static assets (images)
└── README.md             # This file
```

## Features Overview

### Client Dashboard
- View booking statistics
- Manage upcoming bookings
- Quick actions for new bookings
- Recent notifications
- Profile management

### Service Provider Dashboard
- Business metrics and earnings
- Today's schedule management
- Service status updates
- Recent reviews
- Monthly earnings chart

### Admin Dashboard
- Platform-wide statistics
- User management
- Recent activity monitoring
- Platform growth metrics
- Revenue analytics

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Charts**: Chart.js
- **Authentication**: JWT (JSON Web Tokens)

## Customization

### Adding New Features
1. Add new routes in `server.js`
2. Update frontend JavaScript to call new endpoints
3. Add corresponding UI elements in HTML files

### Styling Changes
- All styles use CSS variables defined in `:root`
- Color scheme can be modified in the CSS variables
- Responsive design uses Tailwind CSS classes

## Security Notes

- This is a demo application with in-memory storage
- For production, implement:
  - Database (MongoDB, PostgreSQL, etc.)
  - Environment variables for secrets
  - HTTPS
  - Input validation and sanitization
  - Rate limiting
  - CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

**Note**: This is a demo application. For production use, implement proper security measures, database storage, and error handling. 