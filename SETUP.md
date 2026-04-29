# HaulSync - Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A backend API server (or mock server for development)

## Installation Steps

### 1. Clone or Navigate to Project
```bash
cd d:\TruckLogic
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React and React Router
- Tailwind CSS
- Axios
- Zustand
- React Hot Toast
- Lucide React icons

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=HaulSync
```

### 4. Start Development Server

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

## Using Demo Credentials

For testing, use these credentials:

**Email:** admin@haulsync.com  
**Password:** demo123

## Project Structure Overview

```
haulsync/
├── src/
│   ├── api/              # API configuration & services
│   ├── components/       # Reusable UI components
│   ├── context/          # State management (Zustand)
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout wrappers
│   ├── pages/            # Page components
│   ├── utils/            # Helper functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── README.md           # Documentation
```

## Key Features to Explore

### 1. Authentication
- Go to `/login` to test the login flow
- Register a new account at `/register`
- Authentication tokens are persisted in localStorage

### 2. Dashboard
- View business metrics and recent activity
- See quick statistics about trucks and jobs
- Monitor revenue and payment status

### 3. Truck Management
- Create, edit, and delete trucks
- Track truck status and assigned drivers
- Monitor truck capacity

### 4. Job Management
- Create jobs with automatic cost calculation
- Assign trucks to jobs
- Track job status through the workflow

### 5. Approval Workflow
- Review pending jobs for approval
- Approve or reject jobs with reasons

### 6. Invoicing & Payments
- Generate invoices automatically
- Record single and bulk payments
- Track payment status and outstanding balances

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Component Examples

### Using the Button Component
```jsx
import { Button } from '../components'

<Button onClick={handleClick} variant="primary" size="md">
  Click Me
</Button>
```

### Using the Modal Component
```jsx
import { Modal } from '../components'

<Modal 
  isOpen={isOpen} 
  onClose={handleClose} 
  title="Add New Item"
>
  {/* Modal content */}
</Modal>
```

### Using Custom Hooks
```jsx
import { useApi, useMutation, useForm } from '../hooks'

const { data, isLoading, error, execute } = useApi(apiFunction)
const { mutate, isLoading: isMutating } = useMutation(apiFunction)
const form = useForm(initialValues, onSubmit)
```

## API Integration

### Setting Up Backend

Your backend should implement these endpoints. See API_SPEC.md for detailed specifications.

### Example: Adding a New API Service

```javascript
// In src/api/services.js
export const exampleAPI = {
  getAll: () => apiClient.get('/example'),
  getById: (id) => apiClient.get(`/example/${id}`),
  create: (data) => apiClient.post('/example', data),
  update: (id, data) => apiClient.put(`/example/${id}`, data),
  delete: (id) => apiClient.delete(`/example/${id}`),
}
```

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling. Custom colors are configured in `tailwind.config.js`.

### Primary Color Palette
```
primary-50: #f0f9ff
primary-100: #e0f2fe
primary-500: #0ea5e9
primary-600: #0284c7
primary-700: #0369a1
```

## Debugging Tips

### 1. Check Network Requests
Open DevTools → Network tab to see API requests and responses

### 2. Check Console Errors
Open DevTools → Console to see JavaScript errors and warnings

### 3. Check Local Storage
DevTools → Application → Local Storage to see stored auth token and user info

### 4. Check Zustand State
Use Redux DevTools extension or add `localStorage` debugging

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Make sure all imports use correct relative paths

### Issue: Styles not applying
**Solution:** 
- Restart dev server: `npm run dev`
- Clear browser cache
- Check if Tailwind classes are in content array in `tailwind.config.js`

### Issue: API calls failing
**Solution:**
- Check VITE_API_BASE_URL in .env.local
- Ensure backend is running
- Check browser console for CORS errors

### Issue: Authentication not working
**Solution:**
- Verify credentials are correct
- Check that backend auth endpoint exists
- Clear localStorage and try again

## Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure API endpoint
3. ✅ Start dev server
4. ✅ Test with demo credentials
5. ✅ Explore the UI and features
6. ✅ Integrate with your backend
7. ✅ Deploy to production

## Support & Documentation

- Full API documentation: See `API_SPEC.md`
- Component showcase: Check `src/components/`
- Utility functions: See `src/utils/helpers.js`
- Custom hooks: See `src/hooks/index.js`

## Package Versions

```
react: ^18.2.0
react-router-dom: ^6.20.0
axios: ^1.6.2
zustand: ^4.4.1
tailwindcss: ^3.3.6
vite: ^5.0.8
```

---

Happy coding! 🚀
