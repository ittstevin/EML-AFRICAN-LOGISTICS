# HaulSync - API Specification

Complete API endpoints and data structures required for the HaulSync frontend.

## Base URL
```
http://localhost:5000/api
```

All requests should include the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Authentication Endpoints

### POST /auth/register
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "driver"  // admin, operator, driver
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "driver",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/login
Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "driver",
    "phone": "+1234567890"
  }
}
```

### GET /auth/profile
Get current user profile

**Response (200):**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "driver",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

### PUT /auth/profile
Update user profile

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response (200):** Updated user object

### POST /auth/change-password
Change user password

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## Truck Management Endpoints

### GET /trucks
List all trucks (with optional filters)

**Query Parameters:**
- `status`: Available, In Transit, Maintenance
- `driverId`: Filter by driver

**Response (200):**
```json
[
  {
    "id": "truck-001",
    "plateNumber": "ABC-1234",
    "model": "Volvo FH16",
    "year": 2022,
    "capacity": 20000,
    "status": "available",  // available, in_transit, maintenance
    "driverName": "John Smith",
    "createdAt": "2024-01-10T08:00:00Z"
  }
]
```

### GET /trucks/:id
Get specific truck details

**Response (200):** Single truck object

### POST /trucks
Create new truck

**Request Body:**
```json
{
  "plateNumber": "ABC-1234",
  "model": "Volvo FH16",
  "year": 2022,
  "capacity": 20000,
  "status": "available",
  "driverName": "John Smith"
}
```

**Response (201):** Created truck object

### PUT /trucks/:id
Update truck details

**Request Body:** Same as POST

**Response (200):** Updated truck object

### DELETE /trucks/:id
Delete truck

**Response (204):** No content

### PATCH /trucks/:id/status
Update truck status

**Request Body:**
```json
{
  "status": "in_transit"
}
```

**Response (200):**
```json
{
  "message": "Status updated",
  "truck": { /* truck object */ }
}
```

---

## Job Management Endpoints

### GET /jobs
List all jobs (with optional filters)

**Query Parameters:**
- `status`: pending, approved, loaded, in_transit, delivered, completed
- `search`: Search in pickup/delivery location
- `truckId`: Filter by assigned truck

**Response (200):**
```json
[
  {
    "id": "job-001",
    "goodsType": "general",  // general, fragile, hazmat, perishable
    "weight": 5000,
    "distance": 150,
    "pickupLocation": "Warehouse A, City X",
    "deliveryLocation": "Store B, City Y",
    "status": "pending",
    "estimatedCost": 5750.00,
    "assignedTruck": {
      "id": "truck-001",
      "plateNumber": "ABC-1234"
    },
    "notes": "Handle with care",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
]
```

### GET /jobs/:id
Get job details

**Response (200):** Single job object with full details

### POST /jobs
Create new job

**Request Body:**
```json
{
  "goodsType": "general",
  "weight": 5000,
  "distance": 150,
  "pickupLocation": "Warehouse A, City X",
  "deliveryLocation": "Store B, City Y",
  "assignedTruck": "truck-001",
  "estimatedCost": 5750.00,
  "notes": "Handle with care"
}
```

**Response (201):** Created job object

### PUT /jobs/:id
Update job details

**Request Body:** Same as POST

**Response (200):** Updated job object

### DELETE /jobs/:id
Delete job

**Response (204):** No content

### PATCH /jobs/:id/status
Update job status

**Request Body:**
```json
{
  "status": "approved"
}
```

Valid status transitions:
- pending → approved
- approved → loaded
- loaded → in_transit
- in_transit → delivered
- delivered → completed

**Response (200):**
```json
{
  "message": "Job status updated",
  "job": { /* updated job */ }
}
```

### POST /jobs/:jobId/approve
Approve a pending job (Admin/Operator only)

**Response (200):** Updated job with status "approved"

### POST /jobs/:jobId/reject
Reject a pending job (Admin/Operator only)

**Request Body:**
```json
{
  "reason": "Invalid delivery address"
}
```

**Response (200):**
```json
{
  "message": "Job rejected",
  "rejectionReason": "Invalid delivery address"
}
```

### PATCH /jobs/:jobId/load
Mark job as loaded

**Request Body:**
```json
{
  "itemCount": 15,
  "verifiedWeight": 4950,
  "timestamp": "2024-01-21T08:00:00Z"
}
```

**Response (200):** Updated job

### PATCH /jobs/:jobId/deliver
Confirm delivery

**Request Body:**
```json
{
  "confirmationCode": "12345",
  "timestamp": "2024-01-21T14:30:00Z"
}
```

**Response (200):** Updated job

---

## Invoice Endpoints

### GET /invoices
List all invoices

**Query Parameters:**
- `paymentStatus`: pending, partial, completed, failed
- `userId`: Filter by user

**Response (200):**
```json
[
  {
    "id": "inv-001",
    "jobId": "job-001",
    "amount": 5750.00,
    "subtotal": 5500.00,
    "tax": 250.00,
    "paymentStatus": "pending",  // pending, partial, completed, failed
    "paidAmount": 0,
    "dueDate": "2024-02-20T23:59:59Z",
    "isFinalized": false,
    "customerName": "Customer Name",
    "customerEmail": "customer@example.com",
    "items": [
      {
        "description": "Freight charge",
        "amount": 5500.00
      }
    ],
    "createdAt": "2024-01-20T10:00:00Z"
  }
]
```

### GET /invoices/:id
Get invoice details

**Response (200):** Single invoice object

### POST /invoices
Create invoice

**Request Body:**
```json
{
  "jobId": "job-001",
  "customerName": "Customer Name",
  "customerEmail": "customer@example.com",
  "amount": 5750.00,
  "subtotal": 5500.00,
  "tax": 250.00,
  "items": [
    {
      "description": "Freight charge",
      "amount": 5500.00
    }
  ],
  "dueDate": "2024-02-20T23:59:59Z"
}
```

**Response (201):** Created invoice

### PUT /invoices/:id
Update invoice

**Request Body:** Same as POST

**Response (200):** Updated invoice

### DELETE /invoices/:id
Delete invoice

**Response (204):** No content

### PATCH /invoices/:id/finalize
Finalize invoice (lock from editing)

**Response (200):**
```json
{
  "message": "Invoice finalized",
  "isFinalized": true
}
```

### GET /invoices/:id/pdf
Download invoice as PDF

**Response (200):** PDF file binary data

---

## Payment Endpoints

### GET /payments
List all payments

**Query Parameters:**
- `invoiceId`: Filter by invoice
- `method`: Filter by payment method

**Response (200):**
```json
[
  {
    "id": "pay-001",
    "invoiceId": "inv-001",
    "amount": 2875.00,
    "method": "bank",  // cash, bank, mobile_money, check
    "reference": "TXN12345",
    "status": "completed",
    "notes": "Partial payment",
    "createdAt": "2024-01-22T10:00:00Z"
  }
]
```

### GET /payments/:id
Get payment details

**Response (200):** Single payment object

### POST /payments
Record single payment

**Request Body:**
```json
{
  "invoiceId": "inv-001",
  "amount": 2875.00,
  "method": "bank",
  "reference": "TXN12345",
  "notes": "Partial payment"
}
```

**Response (201):** Created payment

### POST /payments/bulk
Record bulk payment for multiple invoices

**Request Body:**
```json
{
  "invoiceIds": ["inv-001", "inv-002"],
  "method": "bank",
  "reference": "BULK12345",
  "notes": "Batch payment"
}
```

**Response (201):**
```json
{
  "message": "Bulk payment recorded",
  "paymentsCreated": 2
}
```

### GET /payments/methods
Get available payment methods

**Response (200):**
```json
[
  { "value": "cash", "label": "Cash" },
  { "value": "bank", "label": "Bank Transfer" },
  { "value": "mobile_money", "label": "Mobile Money" },
  { "value": "check", "label": "Check" }
]
```

---

## Dashboard Endpoints

### GET /dashboard/summary
Get dashboard summary data

**Response (200):**
```json
{
  "totalRevenue": 125750.00,
  "revenueChange": 15.5,
  "activeJobs": 12,
  "jobsChange": 8.3,
  "completedJobs": 87,
  "completedChange": 5.2,
  "pendingPayments": 18500.00,
  "paymentsChange": -12.1,
  "availableTrucks": 8,
  "inTransit": 4,
  "pendingJobs": 3,
  "avgDeliveryTime": "2.5 days",
  "recentActivity": [
    {
      "id": "activity-001",
      "title": "Job JOB-001 completed",
      "description": "Delivery confirmed for shipment to City Y",
      "timestamp": "2024-01-22T14:30:00Z"
    }
  ]
}
```

### GET /dashboard/activity
Get recent activity

**Query Parameters:**
- `limit`: Number of activities to return (default 10)

**Response (200):** Array of activity objects

### GET /dashboard/charts/:type
Get chart data

**Parameters:**
- `type`: revenue, jobs, trucks, payments

**Response (200):** Chart-specific data structure

---

## Notifications Endpoints

### GET /notifications
Get all notifications

**Response (200):**
```json
[
  {
    "id": "notif-001",
    "title": "Job Approved",
    "message": "Your job JOB-001 has been approved",
    "type": "job_update",  // job_update, payment_confirmation, general
    "isRead": false,
    "actionUrl": "/jobs/job-001",
    "createdAt": "2024-01-22T10:00:00Z"
  }
]
```

### GET /notifications?unread=true
Get only unread notifications

**Response (200):** Array of unread notifications

### PATCH /notifications/:id/read
Mark notification as read

**Response (200):**
```json
{
  "message": "Notification marked as read",
  "isRead": true
}
```

### PATCH /notifications/mark-all-read
Mark all notifications as read

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

### DELETE /notifications/:id
Delete notification

**Response (204):** No content

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Types & Validations

### Truck Status
- `available` - Ready for assignment
- `in_transit` - Currently on a job
- `maintenance` - Under maintenance

### Job Status
- `pending` - Awaiting approval
- `approved` - Approved, waiting to be loaded
- `loaded` - Goods loaded onto truck
- `in_transit` - On the way to delivery
- `delivered` - Reached destination
- `completed` - Delivery confirmed

### Payment Status
- `pending` - No payment made
- `partial` - Partial payment made
- `completed` - Fully paid
- `failed` - Payment failed

### Payment Methods
- `cash` - Cash payment
- `bank` - Bank transfer
- `mobile_money` - Mobile money service
- `check` - Check payment

### User Roles
- `admin` - Full system access
- `operator` - Job and truck management
- `driver` - View assigned jobs only

---

## Authentication

All requests (except login/register) require JWT token in header:
```
Authorization: Bearer <token>
```

Token should be stored in localStorage under key `authToken`.

On 401 response, clear token and redirect to login page.

---

## Pagination (Optional)

For list endpoints, optionally support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response Meta:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Notes

- All timestamps should be in ISO 8601 format (UTC)
- All monetary values should be numbers (not strings)
- IDs can be UUID v4 or custom format
- Implement proper role-based access control on backend
- Validate all input data
- Use appropriate HTTP status codes
