import { useEffect, useState } from "react";
import { getBooks, deleteBook, updateBook, getDropdownAuthors, getDropdownGenres } from "../api/books";
import DataTable from 'react-data-table-component';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasWritePermission = user.role?.is_admin || user.role?.permissions?.includes('write');

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (error) {
      console.error('Failed to load books:', error);
      alert('Failed to load books. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [authorsRes, genresRes] = await Promise.all([
        getDropdownAuthors(),
        getDropdownGenres()
      ]);
      setAuthors(authorsRes.data);
      setGenres(genresRes.data);
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
    }
  };

  useEffect(() => {
    loadBooks();
    loadDropdownData();
  }, []);

  const handleEdit = (book) => {
    setEditingBook({...book});
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: editingBook.title,
        author_id: editingBook.author_id,
        genre_id: editingBook.genre_id,
        year_published: editingBook.year_published,
        summary: editingBook.summary
      };
      await updateBook(editingBook.id, updateData);
      setEditingBook(null);
      setShowEditForm(false);
      await loadBooks();
      alert('Book updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        console.log('Deleting book with ID:', id);
        await deleteBook(id);
        console.log('Delete successful, reloading books');
        await loadBooks();
        alert('Book deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        if (error.response?.status === 401) {
          alert('Authentication failed. Please login again.');
        } else if (error.response?.status === 404) {
          alert('Book not found.');
        } else {
          alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
        }
      }
    }
  };

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Author',
      selector: row => {
        const author = authors.find(a => a.id === row.author_id);
        return author ? author.name : row.author || 'Unknown';
      },
      sortable: true,
    },
    {
      name: 'Genre',
      selector: row => {
        const genre = genres.find(g => g.id === row.genre_id);
        return genre ? genre.name : row.genre || 'Unknown';
      },
      sortable: true,
    },
    {
      name: 'Year',
      selector: row => row.year_published,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => handleEdit(row)}
            disabled={!hasWritePermission}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
            disabled={!hasWritePermission}
          >
            Delete
          </button>
        </div>
      ),
      width: '180px',
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <h2>Books</h2>
        
        {showEditForm && (
          <div className="upload-section">
            <h3>Edit Book</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Title"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  value={editingBook.author_id || ''}
                  onChange={(e) => setEditingBook({...editingBook, author_id: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  value={editingBook.genre_id || ''}
                  onChange={(e) => setEditingBook({...editingBook, genre_id: parseInt(e.target.value)})}
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Year Published"
                  type="number"
                  value={editingBook.year_published}
                  onChange={(e) => setEditingBook({...editingBook, year_published: parseInt(e.target.value) || ''})}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Summary (optional)"
                  value={editingBook.summary || ''}
                  onChange={(e) => setEditingBook({...editingBook, summary: e.target.value})}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Book</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowEditForm(false)}
                style={{marginLeft: '10px'}}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        
        <DataTable
          columns={columns}
          data={books}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          progressPending={loading}
          highlightOnHover
          striped
          responsive
          noDataComponent="No books found"
        />
      </div>
    </div>
  );
}
