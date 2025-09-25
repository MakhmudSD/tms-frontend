# TMS Frontend

Transport Management System Frontend built with Vue.js 3, TypeScript, Vite, Vue Router, and Pinia.

## Features

- **Modern Vue.js 3**: Composition API with TypeScript
- **User Registration**: Signup system with automatic admin creation for first user
- **JWT Authentication**: Secure JWT-based login with role-based access
- **Orders Management**: Create, view, edit, and assign drivers to orders
- **Drivers Management**: Manage driver information and status
- **Real-time Tracking**: Live order tracking with progress indicators
- **Responsive Design**: Mobile-friendly interface
- **State Management**: Pinia stores for centralized state
- **API Integration**: Axios-based API service with interceptors

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the frontend:
```bash
npm run dev
```

3. Open `http://localhost:5173` and create your first account:
   - Click "Create Account" button
   - Fill in the signup form
   - **Only the first user becomes admin!** (All subsequent signup attempts are blocked)

> **Note**: Make sure the backend is running and database is set up.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend is running on `http://localhost:3000` with database configured

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API service with Axios
├── components/        # Reusable Vue components
├── pages/            # Page components
│   ├── Login.vue     # Authentication page
│   ├── Orders.vue    # Orders management
│   ├── Drivers.vue   # Drivers management
│   ├── Tracking.vue  # Order tracking
│   └── NotFound.vue  # 404 page
├── router/           # Vue Router configuration
├── store/            # Pinia stores
│   ├── auth.ts       # Authentication store
│   ├── drivers.ts    # Drivers store
│   └── orders.ts      # Orders store
├── types/            # TypeScript type definitions
├── App.vue           # Root component
└── main.ts           # Application entry point
```

## Pages

### Login Page (`/login`)
- User authentication with username/password
- **Signup Form**: Create new accounts (only first user becomes admin, others blocked)
- Modal-based signup with warning messages and admin restriction notice
- Automatic redirect after successful login

### Orders Page (`/orders`)
- View all orders with filtering by status
- Create new orders with customer and location details
- Edit existing orders
- Assign drivers to pending orders
- Order statistics dashboard

### Drivers Page (`/drivers`)
- View all drivers in card layout
- Create new drivers with vehicle information
- Edit driver details
- Update driver status (available/busy/offline)
- View driver performance statistics

### Tracking Page (`/tracking`)
- Real-time order tracking (public access)
- Live order status updates
- Progress indicators for order stages
- Driver information and contact details
- Order statistics overview
- Auto-refresh every 30 seconds

## Authentication

The application uses JWT tokens for authentication:

- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Route guards protect authenticated pages
- Automatic logout on token expiration

## API Integration

The frontend communicates with the NestJS backend through:

- **Base URL**: `http://localhost:3000`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Automatic logout on 401 responses
- **Type Safety**: Full TypeScript support for API responses

## State Management

Pinia stores manage application state:

- **Auth Store**: User authentication and profile
- **Orders Store**: Order data and operations
- **Drivers Store**: Driver data and operations

## Styling

- Modern, responsive design
- CSS Grid and Flexbox layouts
- Gradient backgrounds and smooth transitions
- Mobile-first approach
- Consistent color scheme and typography

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Axios**: HTTP client
- **CSS3**: Modern styling with Grid and Flexbox

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- Hot module replacement enabled
- TypeScript strict mode enabled
- ESLint configured for code quality
- Path aliases configured (`@` for `src/`)
- Environment variables supported
