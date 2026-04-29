# HaulSync Backend API

A production-ready backend API for the HaulSync transport and truck management system.

## Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Operator, Driver)
- **Truck Management**: CRUD operations for trucks with availability tracking
- **Job Management**: Complete job lifecycle from creation to completion
- **Pricing Engine**: Dynamic pricing based on distance, time, goods type, and truck type
- **Approval Workflow**: Admin/Operator approval system for jobs
- **Invoice System**: Automatic invoice generation with payment tracking
- **Payment Processing**: Support for multiple payment methods including bulk payments
- **Audit Logging**: Comprehensive logging of all key actions
- **Security**: Input validation, rate limiting, CORS, and security headers

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Utilities and helpers
│   ├── config/         # Configuration files
│   ├── prisma/         # Database schema
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env` and update the values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/haulsync_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Trucks
- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/:id` - Get truck by ID
- `POST /api/trucks` - Create truck (Admin/Operator)
- `PUT /api/trucks/:id` - Update truck (Admin/Operator)
- `DELETE /api/trucks/:id` - Delete truck (Admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `PATCH /api/jobs/:id/approve` - Approve job (Admin/Operator)
- `PATCH /api/jobs/:id/load` - Mark job as loaded
- `PATCH /api/jobs/:id/deliver` - Confirm delivery
- `PATCH /api/jobs/:id/complete` - Complete job

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/job/:jobId` - Get invoice by job ID

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment
- `POST /api/payments/bulk` - Create bulk payment

## Database Schema

The application uses the following main entities:

- **User**: System users with roles
- **Owner**: Truck owners
- **Truck**: Vehicles with status tracking
- **Job**: Transport jobs with lifecycle
- **Invoice**: Billing documents
- **Payment**: Payment records
- **AuditLog**: Action logging

## Job Lifecycle

1. **Pending** → Job created, awaiting approval
2. **Approved** → Job approved by Admin/Operator, truck assigned
3. **Loaded** → Goods loaded onto truck
4. **In Transit** → Truck en route to destination
5. **Delivered** → Delivery confirmed
6. **Completed** → Invoice generated

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- Input validation with Joi
- Rate limiting
- Security headers with Helmet
- CORS configuration
- SQL injection prevention with Prisma

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Testing

Add tests using Jest and Supertest for API endpoints.

## Deployment

1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Set up database connection
4. Configure reverse proxy (nginx)
5. Enable SSL/TLS

## Contributing

1. Follow the existing code structure
2. Use ESLint for code quality
3. Write comprehensive tests
4. Update documentation

## License

This project is licensed under the ISC License.