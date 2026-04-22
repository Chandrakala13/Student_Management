# Student Management System - Frontend

A modern React frontend for the Student Management System built with Vite, React Router, and Tailwind CSS.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete students
- **Real API Integration**: Connected to Node.js + Express + MongoDB backend
- **Modern UI**: Beautiful responsive design with Tailwind CSS
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during API operations
- **Search & Pagination**: Search students and navigate through pages
- **Optimistic Updates**: Instant UI feedback for better UX

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Fetch API** - Native browser API for HTTP requests

## Project Structure

```
frontend/
src/
  components/          # Reusable UI components
  pages/              # Page components
    Dashboard.jsx     # Main dashboard with student list
    CreateStudent.jsx # Create new student form
    EditStudent.jsx   # Edit existing student form
  services/           # API integration layer
    studentService.js # All API calls to backend
  App.jsx             # Main app component with routing
  App.css             # App-specific styles
  main.jsx            # React entry point
  index.css           # Global styles and Tailwind
.env                 # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# The .env file is already created with:
VITE_API_BASE_URL=http://localhost:5000
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

### Service Layer Architecture

The `studentService.js` file provides a clean abstraction for all API operations:

```javascript
// Available methods:
studentService.getStudents(page, limit, search)
studentService.getStudentById(id)
studentService.createStudent(studentData)
studentService.updateStudent(id, studentData)
studentService.deleteStudent(id)
```

### Error Handling

- Network errors are caught and displayed with user-friendly messages
- Validation errors from the backend are properly handled
- Loading states prevent duplicate API calls
- Optimistic updates for delete operations

### Environment Variables

The frontend uses Vite's environment variable system:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
```

## Component Features

### Dashboard Component

- **Search**: Real-time search by student name
- **Pagination**: Navigate through pages of students
- **CRUD Actions**: Edit and delete buttons for each student
- **Loading States**: Visual feedback during data fetching
- **Error Messages**: Clear error display with dismiss option
- **Empty States**: Helpful messages when no data is available

### Create Student Component

- **Form Validation**: Client-side validation before submission
- **Error Handling**: Backend validation errors displayed
- **Success Feedback**: Success message and auto-redirect
- **Loading States**: Button disabled during submission
- **Reset Function**: Clear form data

### Edit Student Component

- **Data Loading**: Fetches existing student data
- **Not Found Handling**: Graceful handling of missing students
- **Form Pre-filling**: Populates form with current data
- **Update Validation**: Same validation as create form
- **Cancel Option**: Navigate back without saving

## Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom utility classes:

```css
.btn-primary    /* Blue primary buttons */
.btn-success    /* Green success buttons */
.btn-warning    /* Yellow warning buttons */
.btn-danger     /* Red danger buttons */
.btn-secondary  /* Gray secondary buttons */
.card           /* White card containers */
.message-*      /* Success/error message styling */
```

### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive button sizes
- Touch-friendly interface

## Common Issues and Solutions

### CORS Issues

If you encounter CORS errors, ensure your backend has CORS configured:

```javascript
// In your backend app.js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
```

### Network Errors

If you see "Network error" messages:

1. Ensure the backend server is running on port 5000
2. Check that the MongoDB database is connected
3. Verify the API endpoints are accessible

### Build Issues

If the build fails:

1. Check all imports are correct
2. Verify environment variables are set
3. Ensure all dependencies are installed

## Development Tips

### Adding New Features

1. Add new API methods to `studentService.js`
2. Create new components in `src/components/`
3. Add new routes in `App.jsx`
4. Update styles in `index.css` or component files

### Debugging

- Use browser DevTools to inspect API calls
- Check the Network tab for failed requests
- Console logs are included for debugging
- Error messages are user-friendly but detailed in console

### Performance

- Components use React.memo for optimization
- API calls are properly cached
- Loading states prevent unnecessary re-renders
- Pagination limits data transfer

## Production Deployment

### Environment Setup

Update the `.env` file for production:

```bash
VITE_API_BASE_URL=https://your-production-api.com
```

### Build Process

```bash
npm run build
npm run preview  # Test the production build
```

### Deployment Options

- **Static Hosting**: Deploy `dist` folder to Netlify, Vercel, etc.
- **Server-side**: Use with Nginx or Apache
- **CDN**: Upload to CDN for global distribution

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states
4. Test with different screen sizes
5. Update documentation for new features

## License

This project is part of the Student Management System.
