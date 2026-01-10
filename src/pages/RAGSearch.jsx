import { useState } from "react";
import api from "../api/axios";

export default function RAGSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    setResults([]);
    setSearchResponse(null);

    try {
      // Call your exact API: POST /search?query={query}&limit=5
      const response = await api.post(`/search?query=${encodeURIComponent(query)}&limit=5`);
      
      console.log('RAG Search Response:', response.data);
      setSearchResponse(response.data);
      setResults(response.data.results || []);

    } catch (error) {
      console.error('RAG Search failed:', error);
      if (error.response?.status === 404) {
        alert('Search endpoint not found. Please check if the backend is running.');
      } else if (error.response?.status === 500) {
        alert('Search failed due to server error: ' + (error.response?.data?.detail || error.message));
      } else {
        alert('Search failed: ' + (error.response?.data?.detail || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h2>RAG Search</h2>
          <p>Search through your book collection using semantic search</p>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Enter your search query (e.g., genre, author, title)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary search-btn"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searchResponse && (
          <div className="search-info">
            <p><strong>Query:</strong> "{searchResponse.query}"</p>
            <p><strong>Results found:</strong> {results.length}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="search-results">
            <h3>Search Results ({results.length})</h3>
            {results.map((result, index) => (
              <div key={result.book_id || index} className="result-item">
                <div className="result-header">
                  <h4>{result.metadata.title}</h4>
                  <span className="confidence-score">
                    Similarity: {(result.similarity_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="book-details">
                  <p><strong>Author:</strong> {result.metadata.author}</p>
                  <p><strong>Genre:</strong> {result.metadata.genre}</p>
                  <p><strong>Book ID:</strong> {result.metadata.book_id}</p>
                </div>
                <p className="result-content">{result.content}</p>
                <div className="result-footer">
                  <span className="source">Book ID: {result.book_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching through book collection...</p>
          </div>
        )}

        {!loading && results.length === 0 && query && searchResponse && (
          <div className="no-results">
            <p>No results found for "{query}". Try searching for different terms like genre, author names, or book titles.</p>
          </div>
        )}
      </div>
    </div>
  );
}