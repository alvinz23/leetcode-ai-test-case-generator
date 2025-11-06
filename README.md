# LeetCode AI Test Case Generator

Full-stack app that generates AI test cases for LeetCode problems using Gemini API.

## Quick Start

1. **Checkout branch: access latest version with new-main branch **
```bash
git checkout new-main
```

2. **Setup PostgreSQL:**
```bash
brew services start postgresql@16
```

3. **Setup Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

4. **Setup Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

**backend/.env:**
```
DJANGO_SECRET_KEY=your_secret_key
DEBUG=true
POSTGRES_DB=leetcode_ai
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Scrape Problems

```bash
cd backend
source .venv/bin/activate
python manage.py scrape_all_neetcode
```

Takes 10-15 minutes. Check `scrape_all_neetcode.log` for progress.

## Tech Stack

- Frontend: Next.js (SSR/ISR/CSR)
- Backend: Django REST Framework
- Database: PostgreSQL
- LLM: Google Gemini API

## Features

- Browse 75 NeetCode problems
- Generate AI test cases with customizable sliders
- Smart test case formatting (arrays, matrices, linked lists)
- Real-time search filtering
```
