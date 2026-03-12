#  Novi – AI-Powered Learning Platform

**Novi** is a full-stack web application that transforms PDF documents into interactive lessons and quizzes using AI.

It showcases real-world full-stack development, API design, authentication, database management, and modern UI practices.

---

##  Features
- Upload PDF documents
- AI-generated lessons & quizzes
- Real-time preview
- JWT authentication
- Content management dashboard
- Responsive modern UI
> ⚠️ AI generation falls back to mock data when API quota is exceeded.

##  Tech Stack & Tools

### Backend
- **Django** → https://www.djangoproject.com/
- **Django REST Framework** → https://www.django-rest-framework.org/
- **Python 3** → https://www.python.org/
- **JWT Authentication** → https://jwt.io/

### Database
- **SQLite** → https://www.sqlite.org/

### Frontend
- **React 18** → https://react.dev/
- **TypeScript** → https://www.typescriptlang.org/
- **TanStack Router** → https://tanstack.com/router
- **Tailwind CSS** → https://tailwindcss.com/
- **Vite** → https://vitejs.dev/
- **Lucide Icons** → https://lucide.dev/

---

## **Backend (Django)**

1. Navigate to the backend folder:

```bash
cd DjangoWithAI
```

2. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies (if `requirements.txt` exists):

```bash
pip install -r requirements.txt
```

4. Run the Django development server:

```bash
python3 manage.py runserver
```

The backend should now be running at `http://127.0.0.1:8000/`.

---

## **Frontend**

1. Navigate to the frontend folder (if separate, otherwise stay in root):

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the development server:

```bash
npm run dev
```

The frontend should now be running, usually at `http://localhost:3000/`.

---

## **Notes**

* Make sure the backend server is running before interacting with the frontend.


