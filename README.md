# 📚 Book Management & AI RAG Platform (Frontend)

## Overview
**Book Management & AI RAG Platform** is a **React-based web application** that provides end-to-end management of **books, authors, genres, and documents**, along with **AI-powered Retrieval-Augmented Generation (RAG) search** and **document summarization**.

The application is designed as an **enterprise-ready frontend** that integrates with an AI-enabled backend for **document imbibing, semantic search, and intelligent insights**.

---

## Key Capabilities

### 📖 Content Management
- Books, Authors, and Genres CRUD
- Role-based access control for write/admin actions
- DataTable-based listing with pagination and actions

### 📄 Document Intelligence
- Upload, list, download, and delete documents
- AI-powered document summaries
- Document imbibing & processing pipeline

### 🤖 Generative AI (RAG)
- Semantic document search using RAG
- Query-based retrieval with configurable limits
- Context-aware AI responses

### 👥 User & Role Management
- Token-based authentication
- Admin user & role management
- Permission-based UI controls

---

## Application Modules

| Module | Description |
|------|------------|
| Authentication | Secure login & logout |
| Books | Book CRUD with author & genre mapping |
| Authors Management | Independent CRUD management |
| Documents | Upload, manage, summarize |
| RAG Search | AI-powered document search |
| Imbibing | Background document processing |
| Admin | User & role management |

---

## Pages & Routes

```
/login              → Authentication
/books              → Book management
/add-book           → Create or update books
/author-mgmt       → Authors management
/documents          → Document management
/summary            → Document summary generation
/rag                → RAG-based search
/imbibing          → Document imbibing tracking
/admin/users        → User & role administration
```

---

## AI & RAG Architecture (High Level)

```
User Query
   ↓
React UI
   ↓
Backend API
   ↓
Embeddings + Vector Database
   ↓
Relevant Context Retrieval
   ↓
LLM Response
```

---

## Backend API Expectations

The UI expects a backend server running at:

```
http://127.0.0.1:8000
```

The backend should expose APIs for:
- Authentication & Authorization
- Books, Authors, Genres
- Document Management
- RAG Search
- User & Role Management
- Imbibing & Processing

> Mock data fallback is available when backend services are unavailable.

---

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- React Data Table Component
- Responsive modern CSS

### AI Integration (Backend-Driven)
- RAG-based semantic search
- AI document summarization
- Vector-based retrieval

---

## Local Development

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation
```bash
git clone <your-repo-url>
cd book_mgmt_frontend
npm install
```

### Run Application
```bash
npm start
```

Access the application at:  
👉 http://localhost:3000

---

## Docker Deployment

### Build Image
```bash
docker build -t book_mgmt_frontend .
```

### Run Container
```bash
docker run -p 3000:80 book_mgmt_frontend
```

---

## Project Structure

```
src/
├── api/            # API configuration & services
├── auth/           # Authentication logic
├── components/     # Reusable UI components
├── pages/          # Application pages
├── styles/         # Global & responsive styles
└── index.css
```

---

## Mock Data Support
The application includes **mock API fallbacks**, enabling:
- Frontend development without backend
- UI demos and testing
- Faster contributor onboarding

---

## Roadmap
- Advanced RAG filtering
- Role-based feature toggles
- Search relevance tuning
- Usage analytics dashboard

---

## License
MIT
