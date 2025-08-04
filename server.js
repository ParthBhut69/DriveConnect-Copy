const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(session({
  secret: 'driveconnect-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// In-memory storage (replace with database in production)
let users = [
  {
    id: 1,
    email: 'client@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Rahul Sharma',
    role: 'client',
    phone: '+91 9876543210'
  },
  {
    id: 2,
    email: 'provider@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Amit Kumar',
    role: 'provider',
    phone: '+91 9876543211'
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
    role: 'admin',
    phone: '+91 9876543212'
  }
];

let bookings = [
  {
    id: 1,
    clientId: 1,
    providerId: 2,
    service: 'Interior & Exterior Wash',
    carModel: 'Honda City',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    price: 499,
    location: 'Mumbai'
  },
  {
    id: 2,
    clientId: 1,
    providerId: 2,
    service: 'Wheel Balancing',
    carModel: 'Honda City',
    date: '2024-01-20',
    time: '2:00 PM',
    status: 'pending',
    price: 299,
    location: 'Mumbai'
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, 'driveconnect-jwt-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/client-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-dashboard.html'));
});

app.get('/provider-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'provider-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// API Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      'driveconnect-jwt-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'client'
    };
    
    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      'driveconnect-jwt-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone
  });
});

// Get client bookings
app.get('/api/client/bookings', authenticateToken, (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const userBookings = bookings.filter(b => b.clientId === req.user.id);
  res.json(userBookings);
});

// Get provider bookings
app.get('/api/provider/bookings', authenticateToken, (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const providerBookings = bookings.filter(b => b.providerId === req.user.id);
  res.json(providerBookings);
});

// Get all bookings (admin)
app.get('/api/admin/bookings', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(bookings);
});

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  let stats = {};
  
  if (req.user.role === 'client') {
    const userBookings = bookings.filter(b => b.clientId === req.user.id);
    stats = {
      totalBookings: userBookings.length,
      completedServices: userBookings.filter(b => b.status === 'completed').length,
      totalSpent: userBookings.reduce((sum, b) => sum + b.price, 0),
      upcomingBookings: userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length
    };
  } else if (req.user.role === 'provider') {
    const providerBookings = bookings.filter(b => b.providerId === req.user.id);
    stats = {
      totalBookings: providerBookings.length,
      completedServices: providerBookings.filter(b => b.status === 'completed').length,
      totalEarnings: providerBookings.reduce((sum, b) => sum + b.price, 0),
      averageRating: 4.8
    };
  } else if (req.user.role === 'admin') {
    stats = {
      totalUsers: users.length,
      serviceProviders: users.filter(u => u.role === 'provider').length,
      totalBookings: bookings.length,
      platformRevenue: bookings.reduce((sum, b) => sum + b.price, 0)
    };
  }
  
  res.json(stats);
});

// Create new booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { service, carModel, date, time, providerId, price } = req.body;
    
    const newBooking = {
      id: bookings.length + 1,
      clientId: req.user.id,
      providerId: parseInt(providerId),
      service,
      carModel,
      date,
      time,
      status: 'pending',
      price: parseInt(price),
      location: 'Mumbai'
    };
    
    bookings.push(newBooking);
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status
app.put('/api/bookings/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = bookings.find(b => b.id === parseInt(id));
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check permissions
    if (req.user.role === 'client' && booking.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'provider' && booking.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    booking.status = status;
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const safeUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone
  }));
  
  res.json(safeUsers);
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚗 DriveConnect server running on http://localhost:${PORT}`);
  console.log(`📱 Client Dashboard: http://localhost:${PORT}/client-dashboard`);
  console.log(`🔧 Provider Dashboard: http://localhost:${PORT}/provider-dashboard`);
  console.log(`👨‍💼 Admin Dashboard: http://localhost:${PORT}/admin-dashboard`);
}); 