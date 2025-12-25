# AnonStreak

Anonymous image sharing application built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and Cloudinary.

## Features

- 🎯 **Anonymous Upload**: Share images anonymously without tracking
- 🔒 **Secure Admin Panel**: Arabic RTL admin dashboard with authentication
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🎨 **Modern UI**: Dark muted design with smooth animations
- ⚡ **Real-time Progress**: Upload progress tracking
- 🗑️ **Image Management**: Admin can view and delete uploaded images

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn/UI
- **Database**: Supabase
- **File Storage**: Cloudinary
- **Authentication**: Custom cookie-based auth

## Project Structure

```
src/
├── app/
│   ├── actions.ts              # Server actions for upload/delete
│   ├── admin/
│   │   ├── auth-actions.ts     # Authentication actions
│   │   ├── login-form.tsx      # Arabic login form
│   │   ├── page.tsx            # Login page
│   │   └── dashboard/
│   │       ├── page.tsx        # Admin dashboard
│   │       └── logout-button.tsx
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Public upload page
├── components/
│   ├── image-grid.tsx          # Admin image grid
│   ├── upload-zone.tsx         # Upload component
│   └── ui/                     # Shadcn UI components
└── lib/
    ├── cloudinary.ts           # Cloudinary config
    ├── supabase.ts             # Supabase clients
    ├── utils.ts                # Utility functions
    └── validations.ts          # Zod schemas

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Authentication
ADMIN_PASSWORD=your_secure_password
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL editor:

```sql
-- See supabase-schema.sql file
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage

### Public Upload

1. Visit the homepage
2. Drag & drop an image or click the circular button
3. Wait for upload to complete
4. Image is stored anonymously

### Admin Access

1. Go to `/admin`
2. Enter admin password
3. View all uploaded images in `/admin/dashboard`
4. Delete images as needed

## Security Features

- ✅ Environment variable validation
- ✅ Input validation on all actions
- ✅ Secure cookie-based authentication
- ✅ Service role key for admin operations
- ✅ Row Level Security (RLS) on Supabase
- ✅ Signed Cloudinary uploads

## Code Quality

### Error Handling
- All server actions have try-catch blocks
- Proper error messages returned to client
- Console logging for debugging

### Validation
- Environment variables validated at startup
- Input parameters validated before processing
- File type and size validation

### Type Safety
- Full TypeScript coverage
- Proper type definitions for all functions
- Interface for database schema

## Development

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Deployment

1. Push code to GitHub
2. Deploy to Vercel/Netlify
3. Add environment variables in deployment settings
4. Ensure Supabase database is accessible
5. Test upload and admin functionality

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
