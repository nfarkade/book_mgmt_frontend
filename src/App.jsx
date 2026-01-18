import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";

// Lazy load pages for better performance
const Login = lazy(() => import("./auth/Login"));
const Signup = lazy(() => import("./auth/Signup"));
const Books = lazy(() => import("./pages/Books"));
const AddBook = lazy(() => import("./pages/AddBook"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AuthorManagement = lazy(() => import("./pages/AuthorManagement"));
const Documents = lazy(() => import("./pages/Documents"));
const Imbibing = lazy(() => import("./pages/Imbibing"));
const RAGSearch = lazy(() => import("./pages/RAGSearch"));
const Summary = lazy(() => import("./pages/Summary"));

function AppContent() {
  const location = useLocation();
  const showNavbar = !['/login', '/signup'].includes(location.pathname);
  
  // Get user from localStorage for Navbar
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  return (
    <>
      {showNavbar && <Navbar user={getUser()} />}
      <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
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
          
          <Route path="/author-mgmt" element={
            <ProtectedRoute><AuthorManagement /></ProtectedRoute>
          }/>
          
          <Route path="/admin/users" element={
            <ProtectedRoute><AdminUsers /></ProtectedRoute>
          } />

          <Route path="/documents" element={
            <ProtectedRoute><Documents /></ProtectedRoute>
          } />

          <Route path="/imbibing" element={
            <ProtectedRoute><Imbibing /></ProtectedRoute>
          } />

          <Route path="/rag" element={
            <ProtectedRoute><RAGSearch /></ProtectedRoute>
          } />

          <Route path="/summary" element={
            <ProtectedRoute><Summary /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
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
