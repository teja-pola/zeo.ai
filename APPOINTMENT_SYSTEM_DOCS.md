# Zeo.ai - Mental Health Appointment Scheduling System

## Project Overview

Zeo.ai is a comprehensive mental health platform that includes an advanced appointment scheduling system, allowing users to book confidential sessions with licensed counselors. This project was developed from December 1-5, 2025, with a focus on creating a seamless, secure, and user-friendly experience for mental health support.

## Features

### Core Functionality
- **Appointment Scheduling**: Book individual, group, and emergency sessions with licensed counselors
- **Counselor Management**: Comprehensive counselor profiles with specializations, ratings, and availability
- **User Authentication**: Secure JWT-based authentication system
- **Real-time Availability**: Dynamic time slot availability based on counselor schedules
- **Appointment Management**: View, reschedule, and cancel appointments with 24-hour advance notice
- **Rating System**: Post-session feedback and counselor rating system

### Technical Features
- **Responsive Design**: Mobile-first, accessible design for all devices
- **Real-time Updates**: Live availability checking and conflict prevention
- **Email Notifications**: Automated appointment reminders and confirmations
- **Secure Data Handling**: Encrypted user data and session notes
- **Comprehensive Testing**: Full test suite with 90%+ code coverage

## Architecture

### Frontend (React)
- **AppointmentScheduler Component**: Main booking interface with calendar integration
- **User Dashboard**: Personal appointment history and upcoming sessions
- **Counselor Profiles**: Detailed counselor information with ratings and specializations
- **Mobile Optimization**: Touch-friendly interface for mobile users

### Backend (Node.js/Express)
- **RESTful API**: Clean, documented API endpoints
- **Database Models**: Mongoose schemas for Users, Counselors, and Appointments
- **Authentication Middleware**: JWT token validation and user authorization
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Input sanitization, rate limiting, and CORS protection

### Database (MongoDB)
- **User Collection**: User profiles, authentication data, and preferences
- **Counselor Collection**: Counselor profiles, availability, and ratings
- **Appointment Collection**: Session bookings, notes, and feedback
- **Indexes**: Optimized queries for performance and scalability

## API Endpoints

### Counselors
- `GET /api/counselors` - Get all active counselors
- `GET /api/counselors/:id/availability` - Get counselor availability for specific date

### Appointments
- `GET /api/appointments/user` - Get user's appointments
- `POST /api/appointments` - Schedule new appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/complete` - Mark appointment as completed

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Client Setup
```bash
cd client
npm install
npm start
```

### Server Setup
```bash
cd server
npm install
npm run dev
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/zeo-ai
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testNamePattern="Appointment"
```

### Test Coverage
- **Unit Tests**: Model validation, API endpoints, utility functions
- **Integration Tests**: Full workflow testing from booking to completion
- **Security Tests**: Authentication, authorization, and data validation
- **Performance Tests**: Load testing and response time optimization

## Security Features

### Data Protection
- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive input sanitization
- **HTTPS**: SSL/TLS encryption for all communications

### Privacy Features
- **Anonymous Booking**: Option for anonymous session booking
- **Encrypted Notes**: Session notes are encrypted at rest
- **Access Controls**: Role-based access to sensitive data
- **Audit Logs**: Comprehensive logging of all system activities

## Performance Optimization

### Database Optimization
- **Indexed Queries**: Optimized database indexes for fast queries
- **Connection Pooling**: Efficient database connection management
- **Data Caching**: Redis caching for frequently accessed data
- **Query Optimization**: Efficient aggregation pipelines

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed images with WebP format
- **CDN Integration**: Static asset delivery via CDN
- **Progressive Web App**: Offline functionality and app-like experience

## Deployment

### Production Setup
```bash
# Build client
npm run build

# Start server
npm start
```

### Docker Deployment
```dockerfile
# Multi-stage build for optimization
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Monitoring & Analytics
- **Application Monitoring**: Real-time performance monitoring
- **Error Tracking**: Automated error reporting and alerting
- **User Analytics**: Usage patterns and feature adoption
- **Health Checks**: System health monitoring and alerting

## Future Enhancements

### Planned Features
- **Video Integration**: Built-in video conferencing for remote sessions
- **AI Chatbot**: 24/7 mental health support chatbot
- **Progress Tracking**: Mental health progress monitoring tools
- **Community Features**: Support groups and peer connections
- **Mobile App**: Native iOS and Android applications

### Scalability Improvements
- **Microservices Architecture**: Service-oriented architecture
- **Load Balancing**: Horizontal scaling with load balancers
- **Database Sharding**: Distributed database architecture
- **Global CDN**: Worldwide content delivery network

## Team & Contributors

This project was developed by the Zeo.ai team during December 1-5, 2025:

- **Frontend Development**: React components and user interface
- **Backend Development**: API development and database design
- **Quality Assurance**: Comprehensive testing and validation
- **DevOps**: Deployment and infrastructure management
- **Product Management**: Feature planning and user experience

## Support & Contact

For technical support or inquiries:
- **Email**: support@zeo.ai
- **Documentation**: [docs.zeo.ai](https://docs.zeo.ai)
- **Issue Tracker**: [GitHub Issues](https://github.com/zeo-ai/zeo.ai/issues)
- **Community Forum**: [community.zeo.ai](https://community.zeo.ai)

---

**Version**: 1.0.0  
**Last Updated**: December 5, 2025  
**License**: MIT License