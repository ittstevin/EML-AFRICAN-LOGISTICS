# HaulSync - Transport & Truck Management System

A modern, responsive web application for transport and truck management built with React, Vite, Tailwind CSS, and Zustand.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure token storage
- Auto-logout on token expiration

### 📊 Dashboard
- Summary cards (revenue, active jobs, completed jobs, pending payments)
- Quick statistics
- Recent activity feed

### 🚛 Truck Management
- View all trucks in a table
- Add/Edit/Delete trucks
- Track truck status (Available, In Transit, Maintenance)
- Assign drivers to trucks
- Capacity management

### 📦 Job Management
- Create new jobs with cargo details
- Assign trucks to jobs
- Automatic cost calculation based on distance, weight, and goods type
- Job status workflow: Pending → Approved → Loaded → In Transit → Delivered → Completed
- View job details and history

### ✅ Approval Workflow
- Review pending jobs
- Approve/Reject jobs
- Add rejection reasons
- Track approval history

### 📋 Loading & Dispatch
- Mark approved jobs as loaded
- Record item counts and verified weights
- Track dispatch timestamps

### 🚚 Delivery Confirmation
- Confirm deliveries when jobs are completed
- OTP/Confirmation code verification
- Update job status to delivered

### 📄 Invoicing
- Generate invoices for completed jobs
- View invoice details and breakdown
- Download invoices as PDF (when integrated with backend)
- Track invoice payment status
- Lock finalized invoices from editing

### 💳 Payments
- Record single payments
- Record bulk payments for multiple invoices
- Support multiple payment methods (Cash, Bank, Mobile Money, Check)
- Track payment history
- Display payment summary and outstanding balance

### 🔔 Notifications
- Real-time alerts for job updates
- Payment confirmations
- Mark notifications as read
- Delete notifications
- Filter by read/unread status

### 👤 User Profiles
- View and edit profile information
- Change password securely
- Account status and security settings
- Security tips and recommendations

### 🔐 Role-Based Access Control
- Admin: Full system access
- Operator: Job management and approval
- Driver: View assigned jobs only

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Alert.jsx
│   │   ├── FormFields.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Table.jsx
│   ├── layout/           # Layout components
│   │   ├── Sidebar.jsx
│   │   └── TopNavbar.jsx
│   └── dashboard/        # Dashboard specific components
│       └── SummaryCard.jsx
├── pages/
│   ├── auth/             # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── dashboard/        # Dashboard
│   │   └── DashboardPage.jsx
│   ├── trucks/           # Truck management
│   │   └── TruckManagementPage.jsx
│   ├── jobs/             # Job management
│   │   ├── JobManagementPage.jsx
│   │   └── JobDetailsPage.jsx
│   ├── workflow/         # Approval workflow
│   │   └── ApprovalWorkflowPage.jsx
│   ├── dispatch/         # Loading & dispatch
│   │   └── LoadingDispatchPage.jsx
│   ├── delivery/         # Delivery confirmation
│   │   └── DeliveryConfirmationPage.jsx
│   ├── invoices/         # Invoicing
│   │   ├── InvoiceListPage.jsx
│   │   └── InvoiceDetailsPage.jsx
│   ├── payments/         # Payment management
│   │   └── PaymentsPage.jsx
│   ├── notifications/    # Notifications
│   │   └── NotificationsPage.jsx
│   ├── profile/          # User profile
│   │   └── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── layouts/
│   ├── AuthLayout.jsx    # Authentication layout
│   └── MainLayout.jsx    # Main app layout
├── context/
│   └── authStore.js      # Zustand auth state management
├── api/
│   ├── client.js         # Axios configuration
│   └── services.js       # API endpoints
├── hooks/
│   └── index.js          # Custom hooks
├── utils/
│   └── helpers.js        # Utility functions
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env.local
```

3. **Configure API endpoint:**
Edit `.env.local` and set your backend API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start development server:**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Recharts** - Charts (optional)

## API Integration

All API calls are made through the `src/api/services.js` file. Update the endpoints to match your backend:

- `/auth` - Authentication endpoints
- `/trucks` - Truck management
- `/jobs` - Job management
- `/invoices` - Invoicing
- `/payments` - Payment processing
- `/dashboard` - Dashboard data
- `/notifications` - Notifications

## Authentication

- Tokens are stored in `localStorage` under the key `authToken`
- User info is stored in `localStorage` under the key `user`
- Axios automatically includes the token in request headers
- Auto-logout on 401 response

## Demo Credentials

```
Email: admin@haulsync.com
Password: demo123
```

## Security Features

- Protected routes with role-based access control
- Secure token storage
- Auto-logout on unauthorized access
- CSRF protection ready (when integrated with secure backend)
- Password change functionality
- Session management

## Styling

Uses Tailwind CSS with custom color theme (primary-600 as main color). Customize colors in `tailwind.config.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Electron desktop app wrapper
- Dark mode support
- Multi-language support (i18n)
- Real-time notifications with WebSockets
- Advanced reporting and analytics
- Mobile app (React Native)
- Map integration for location tracking
- Document upload and storage

## Backend Requirements

Your backend should provide the following API endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile
- `POST /auth/change-password` - Change password

### Trucks
- `GET /trucks` - List all trucks
- `GET /trucks/:id` - Get truck details
- `POST /trucks` - Create truck
- `PUT /trucks/:id` - Update truck
- `DELETE /trucks/:id` - Delete truck
- `PATCH /trucks/:id/status` - Update truck status

### Jobs
- `GET /jobs` - List jobs (supports filters)
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `PATCH /jobs/:id/status` - Update job status

### Invoices
- `GET /invoices` - List invoices
- `GET /invoices/:id` - Get invoice
- `POST /invoices` - Create invoice
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice
- `GET /invoices/:id/pdf` - Download PDF
- `PATCH /invoices/:id/finalize` - Finalize invoice

### Payments
- `GET /payments` - List payments
- `POST /payments` - Record payment
- `POST /payments/bulk` - Record bulk payment
- `GET /payments/methods` - Get payment methods

### Dashboard
- `GET /dashboard/summary` - Dashboard summary data
- `GET /dashboard/activity` - Recent activity

### Notifications
- `GET /notifications` - Get all notifications
- `GET /notifications?unread=true` - Get unread
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## Troubleshooting

**Issue: API calls failing with 404**
- Check that `VITE_API_BASE_URL` is correctly set in `.env.local`
- Ensure backend is running and accessible

**Issue: Authentication not working**
- Check browser console for CORS errors
- Verify backend is configured to allow requests from your domain

**Issue: Styles not loading**
- Clear browser cache
- Restart dev server

## License

MIT

## Support

For issues and feature requests, please open an issue on the project repository.
