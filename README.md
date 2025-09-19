# User Project Dashboard

A Node.js web application that allows users to upload projects and media files, with admin functionality to manage users and send messages.

## Features

- User authentication (register/login)
- Admin and regular user roles
- File upload system (projects and media)
- User-specific file visibility
- Admin-to-user messaging system
- Responsive design with separate CSS files

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values:
     - `JWT_SECRET`: Your JWT secret key
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: Server port (default: 3000)

4. Start MongoDB service (if using local MongoDB)

5. Seed the database with sample users:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

7. Open your browser and go to `http://localhost:3000`

## Default Credentials

After running the seed script:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Regular User Account:**
- Email: user@example.com
- Password: user123

## Project Structure

```
├── models/           # Database models
├── routes/           # Express routes
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── views/            # EJS templates
├── public/css/       # CSS stylesheets
├── uploads/          # File upload directory
├── server.js         # Main server file
├── seed.js           # Database seeding script
└── .env              # Environment variables
```

## Features Demo

1. **User Registration/Login**: Create accounts with admin flag option
2. **File Upload**: Users can upload project files and media
3. **Admin Dashboard**: View all users and their uploads
4. **Messaging**: Admins can send messages to specific users
5. **File Organization**: Files are organized by user ID in separate folders
6. **Security**: JWT authentication and role-based access control

## API Endpoints

- `GET /` - Redirect to login
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /dashboard` - User/Admin dashboard
- `POST /upload/project` - Upload project file
- `POST /upload/media` - Upload media file
- `POST /message/send` - Send message (admin only)
- `GET /logout` - Logout user

## File Upload Features

- Supports multiple file types (images, videos, documents, archives)
- 50MB file size limit
- Files organized in user-specific directories
- Original file names preserved
- File type validation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File type validation
- Protected routes middleware

## Styling

Each page has its own dedicated CSS file:
- `layout.css` - Global styles and navigation
- `auth.css` - Login and registration pages
- `dashboard.css` - User dashboard
- `admin-dashboard.css` - Admin dashboard

The design features a modern, responsive layout with:
- Clean card-based interface
- Gradient backgrounds
- Hover effects and transitions
- Mobile-friendly responsive design