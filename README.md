# 📚 Book Management & AI RAG Platform (Frontend)

## Overview
**Book Management & AI RAG Platform** is a **React-based web application** that provides end-to-end management of **books, authors, genres, and documents**, along with **AI-powered Retrieval-Augmented Generation (RAG) search** and **document summarization**.

The application is designed as an **enterprise-ready frontend** that integrates with an AI-enabled backend for **document imbibing, semantic search, and intelligent insights**.

---

## ✨ Production-Ready Features

### 🧪 Testing
- Comprehensive test suite with Jest and React Testing Library
- Test coverage threshold: 70%+
- Unit tests for components, pages, and utilities
- API mocking and integration tests
- Run tests: `npm test` or `npm run test:coverage`

### 🔍 Code Quality
- ESLint configuration with React best practices
- Prettier for consistent code formatting
- PropTypes for type checking
- Automated linting in CI/CD pipeline

### 🚀 Performance
- Code splitting with React.lazy
- Suspense for loading states
- Debounced search inputs
- Optimized bundle size
- Lazy-loaded routes

### 🛡️ Error Handling
- Centralized error handling utilities
- Error boundaries for React components
- User-friendly error messages
- Network error detection
- Authentication error handling

### 🔐 Security
- Protected routes with authentication
- Secure token storage
- Input validation
- XSS protection
- CSRF-ready architecture

### 📦 CI/CD
- GitHub Actions workflow
- Automated testing on push/PR
- Build verification
- Security scanning
- Multi-node version testing

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
/signup             → User registration
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

## Tech Stack

### Frontend
- React 19
- React Router DOM v7
- Axios for API calls
- React Data Table Component
- PropTypes for type checking
- Jest & React Testing Library

### Development Tools
- ESLint for code linting
- Prettier for code formatting
- GitHub Actions for CI/CD
- Jest for testing

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

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure your API base URL:
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
REACT_APP_ENVIRONMENT=development
```

### Run Application
```bash
npm start
```

Access the application at:  
👉 http://localhost:3000

### Development Scripts
```bash
npm start              # Start development server
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run lint           # Check for linting errors
npm run lint:fix       # Fix linting errors automatically
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run build          # Build for production
```

---

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure
```
src/
├── __tests__/
│   ├── api/          # API tests
│   ├── auth/         # Authentication tests
│   ├── components/   # Component tests
│   └── pages/        # Page tests
```

### Writing Tests
- Use React Testing Library for component tests
- Mock API calls with Jest
- Aim for 70%+ code coverage
- Test user interactions, not implementation details

---

## Code Quality

### Linting
```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting
```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

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

## Production Deployment

See [PRODUCTION.md](./PRODUCTION.md) for detailed production deployment guide including:
- Pre-deployment checklist
- Security configuration
- Performance optimization
- Monitoring setup
- Error tracking

---

## Project Structure

```
src/
├── api/              # API configuration & services
├── auth/             # Authentication logic
├── components/       # Reusable UI components
│   ├── ErrorBoundary.jsx
│   ├── Navbar.jsx
│   ├── LoadingSpinner.jsx
│   └── ConfirmDialog.jsx
├── config/           # Configuration
├── hooks/            # Custom React hooks
│   ├── useErrorHandler.js
│   └── useDebounce.js
├── pages/            # Application pages
├── utils/            # Utility functions
│   ├── errorHandler.js
│   ├── toast.js
│   └── index.js
├── __tests__/        # Test files
└── index.js          # Entry point
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code standards
- Testing requirements
- Commit message format
- Pull request process

---

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- Runs tests on multiple Node.js versions
- Checks code linting
- Builds the application
- Runs security scans
- Uploads coverage reports

---

## License
MIT

---

## Support

For issues and questions:
1. Check existing issues on GitHub
2. Review documentation
3. Create a new issue with detailed information
