import { Link } from "react-router-dom";
import { logout } from "../api/auth";

export default function Navbar() {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };


  return (
    <nav style={{
      background: '#2c3e50',
      padding: '1rem 0',
      marginBottom: '20px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <Link to="/books" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Book Manager
        </Link>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link to="/books" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Books
          </Link>
          <Link to="/add-book" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Add Book
          </Link>
          <Link to="/author-genre" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Authors & Genres
          </Link>
          <Link to="/documents" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Documents
          </Link>
          <Link to="/ingestion" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Ingestion
          </Link>
          <Link to="/rag" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            RAG Search
          </Link>
          <Link to="/summary" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Summary
          </Link>
          <Link to="/admin/users" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Admin
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}