# Novi - AI-Powered Content Management System

## Project Overview

**Novi** is a modern Content Management System that allows users to upload PDFs and generate interactive educational content (lessons and quizzes) using AI. The application features a beautiful, modern UI with gradient designs and smooth animations.

## Technology Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database
- **JWT Authentication** - Token-based auth
- **Python 3.x**

### Frontend
- **React 18** - UI library
- **TanStack Router** - File-based routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **TypeScript** - Type safety

## Major Changes Made

### 1. Branding Update
- **Old Name**: Setsvm
- **New Name**: Novi
- **Logo**: Modern layered stack icon with blue-to-purple gradient
- **Color Scheme**: Blue → Purple → Pink gradients throughout

### 2. Content Management Features
- ✅ **Create Content** - Upload PDFs and generate content
- ✅ **View Content** - Preview content in isolated iframe
- ✅ **Edit Content** - Modify titles, metadata, and HTML body
- ✅ **Delete Content** - Remove content with confirmation dialog
- ✅ **List Content** - View all user content in "My Contents" page

### 3. Database Changes
- Content stored directly in database (`body` field) instead of files
- `html_file` field made optional
- Content model includes: title, subject, grade, content_type, body, metadata

### 4. Modern UI Pages

#### Dashboard (`/dashboard`)
- 4 animated statistics cards (Total, Lessons, Quizzes, This Week)
- Recent content section with quick view/edit actions
- Quick actions panel
- Motivational progress card
- Gradient backgrounds and smooth animations

#### Home Page (`/home`)
- Hero section with animated gradient background
- AI-Powered badge
- Social proof stats (10K+ content, 5K+ users, 99% satisfaction)
- 4 feature cards with unique gradients
- "How It Works" 3-step section
- Benefits section with checkmarks
- Multiple CTAs throughout

#### My Contents (`/my-contents`)
- Grid/list view of all content
- Filter and search capabilities
- Quick actions (View, Edit, Delete)
- Status indicators

#### Content View (`/content/:id`)
- Full content preview in iframe
- Metadata display
- Navigation to edit page

#### Content Edit (`/content/:id/edit`)
- Form for editing metadata
- HTML body editor
- Save changes functionality

### 5. API Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/` - Get JWT token

#### Content Management
- `GET /api/content/` - List user's content
- `POST /api/content/` - Create new content
- `GET /api/content/:id/` - Get content details
- `PUT /api/content/:id/` - Update content
- `DELETE /api/content/:id/` - Delete content

## Project Structure

```
DjangoWithAI/
├── DjangoWithAI/                 # Django Backend
│   ├── auth_services/            # Authentication app
│   ├── cmanagement_service/      # Content management app
│   │   └── content/              # Content models, views, serializers
│   ├── ai_service/               # AI processing service
│   ├── project/                  # Django settings
│   ├── manage.py
│   └── db.sqlite3
│
└── setsvm/                       # React Frontend
    ├── src/
    │   ├── components/           # Reusable components
    │   │   ├── Navbar.tsx        # Navigation with Novi branding
    │   │   └── ProtectedRoute.tsx
    │   ├── contexts/             # React contexts
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   └── api.ts            # API client
    │   ├── routes/               # Page components
    │   │   ├── home.tsx          # Landing page
    │   │   ├── dashboard.tsx     # User dashboard
    │   │   ├── my-contents.tsx   # Content list
    │   │   ├── create-content.tsx
    │   │   ├── login.tsx
    │   │   ├── signup.tsx
    │   │   └── content/
    │   │       ├── $contentId.tsx      # View content
    │   │       └── $contentId/
    │   │           └── edit.tsx        # Edit content
    │   ├── main.tsx
    │   └── routeTree.gen.ts
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Setup Instructions for New Device

### Prerequisites
- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** (optional, for version control)

### Step 1: Clone/Copy Project
```bash
# If using Git
git clone <your-repo-url>
cd DjangoWithAI

# Or copy the entire project folder to your new device
```

### Step 2: Backend Setup

1. **Navigate to Django project**
```bash
cd DjangoWithAI/DjangoWithAI
```

2. **Create virtual environment** (recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies**
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

4. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser** (optional, for admin access)
```bash
python manage.py createsuperuser
```

6. **Start Django server**
```bash
python manage.py runserver
```
Backend will run on `http://localhost:8000`

### Step 3: Frontend Setup

1. **Open new terminal and navigate to frontend**
```bash
cd DjangoWithAI/setsvm
```

2. **Install Node dependencies**
```bash
npm install
```

3. **Generate route tree**
```bash
npx @tanstack/router-cli generate
```

4. **Start development server**
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### Step 4: Access Application

1. Open browser and go to `http://localhost:3000`
2. You should see the Novi home page
3. Click "Get Started Free" to register
4. After registration, login and start creating content

## Environment Configuration

### Backend (`DjangoWithAI/project/settings.py`)
- `DEBUG = True` (for development)
- `ALLOWED_HOSTS = ['localhost', '127.0.0.1']`
- `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`

### Frontend (`setsvm/src/lib/api.ts`)
- `API_BASE_URL = 'http://localhost:8000'`

## Key Features

### Authentication
- JWT-based authentication
- Persistent login sessions
- Protected routes for authenticated users

### Content Creation
- PDF upload
- AI-powered content generation
- Support for lessons and quizzes
- Customizable metadata (title, subject, grade)

### Content Management
- CRUD operations (Create, Read, Update, Delete)
- Content stored in database
- Search and filter capabilities
- Status tracking (draft, published)

### Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Gradient backgrounds and animations
- Smooth transitions and hover effects
- Loading states and error handling
- Confirmation dialogs for destructive actions

## API Configuration

The frontend communicates with the backend via REST API:
- Base URL: `http://localhost:8000/api/`
- Authentication: JWT tokens in Authorization header
- Content-Type: `application/json`

## Database Schema

### User Model (Django default)
- username
- email
- password (hashed)

### Content Model
- id (auto)
- user (ForeignKey to User)
- title
- subject
- grade
- content_type (lesson/quiz)
- body (TextField - HTML content)
- html_file (URLField - optional)
- metadata (JSONField)
- created_at
- updated_at

## Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Kill the process or use different port
- **Database errors**: Delete `db.sqlite3` and run migrations again
- **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in settings.py

### Frontend Issues
- **Port 3000 already in use**: Vite will prompt to use different port
- **Route not found**: Run `npx @tanstack/router-cli generate`
- **Import errors**: Delete `node_modules` and run `npm install` again
- **Build errors**: Clear Vite cache: `rm -rf node_modules/.vite`

### Common Commands

**Backend:**
```bash
# Run server
python manage.py runserver

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

**Frontend:**
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve

# Generate routes
npx @tanstack/router-cli generate
```

## Production Deployment

### Backend
1. Set `DEBUG = False`
2. Configure `ALLOWED_HOSTS`
3. Use PostgreSQL instead of SQLite
4. Set up static files serving
5. Use gunicorn/uwsgi for WSGI server
6. Set up environment variables for secrets

### Frontend
1. Update `API_BASE_URL` to production backend URL
2. Run `npm run build`
3. Deploy `dist/` folder to hosting service
4. Configure environment variables

## Support

For issues or questions:
- Check the code comments
- Review Django and React documentation
- Check browser console for errors
- Check Django server logs

## License

[Your License Here]

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
**Author**: Novi Development Team
