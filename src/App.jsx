import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import AdminUsers from "./pages/AdminUsers";
import AuthorGenre from "./pages/AuthorGenre";
import Documents from "./pages/Documents";
import Ingestion from "./pages/Ingestion";
import RAGSearch from "./pages/RAGSearch";
import Summary from "./pages/Summary";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

function AppContent() {
  const location = useLocation();
  const showNavbar = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />

        <Route path="/books" element={
          <ProtectedRoute><Books /></ProtectedRoute>
        }/>

        <Route path="/add-book" element={
          <ProtectedRoute><AddBook /></ProtectedRoute>
        }/>
        
        <Route path="/author-genre" element={
          <ProtectedRoute><AuthorGenre /></ProtectedRoute>
        }/>
        
        <Route path="/admin/users" element={
  <ProtectedRoute><AdminUsers /></ProtectedRoute>
} />

<Route path="/documents" element={
  <ProtectedRoute><Documents /></ProtectedRoute>
} />

<Route path="/ingestion" element={
  <ProtectedRoute><Ingestion /></ProtectedRoute>
} />

<Route path="/rag" element={
  <ProtectedRoute><RAGSearch /></ProtectedRoute>
} />

<Route path="/summary" element={
  <ProtectedRoute><Summary /></ProtectedRoute>
} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
