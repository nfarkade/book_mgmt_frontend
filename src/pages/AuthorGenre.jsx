import { useEffect, useState } from "react";
import { getAuthors, createAuthor, updateAuthor, deleteAuthor, getGenres, createGenre, updateGenre, deleteGenre } from "../api/books";
import DataTable from 'react-data-table-component';

export default function AuthorGenre() {
  const [activeTab, setActiveTab] = useState('authors');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasWritePermission = user.role?.is_admin || user.role?.permissions?.includes('write');

  const loadAuthors = async () => {
    try {
      const res = await getAuthors();
      setAuthors(res.data);
    } catch (error) {
      console.error('Failed to load authors:', error);
    }
  };

  const loadGenres = async () => {
    try {
      const res = await getGenres();
      setGenres(res.data);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadAuthors(), loadGenres()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        if (activeTab === 'authors') {
          await updateAuthor(editingItem.id, formData);
          await loadAuthors();
        } else {
          await updateGenre(editingItem.id, formData);
          await loadGenres();
        }
      } else {
        if (activeTab === 'authors') {
          await createAuthor(formData);
          await loadAuthors();
        } else {
          await createGenre(formData);
          await loadGenres();
        }
      }
      setShowForm(false);
      alert(`${activeTab.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        if (activeTab === 'authors') {
          await deleteAuthor(id);
          await loadAuthors();
        } else {
          await deleteGenre(id);
          await loadGenres();
        }
        alert(`${activeTab.slice(0, -1)} deleted successfully`);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed');
      }
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
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
        <h2>Authors & Genres Management</h2>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'authors' ? 'active' : ''}`}
            onClick={() => setActiveTab('authors')}
          >
            Authors
          </button>
          <button 
            className={`tab ${activeTab === 'genres' ? 'active' : ''}`}
            onClick={() => setActiveTab('genres')}
          >
            Genres
          </button>
        </div>

        <div className="tab-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>{activeTab === 'authors' ? 'Authors' : 'Genres'}</h3>
            <button 
              className="btn btn-primary" 
              onClick={handleAdd}
              disabled={!hasWritePermission}
            >
              Add {activeTab === 'authors' ? 'Author' : 'Genre'}
            </button>
          </div>

          {showForm && (
            <div className="upload-section">
              <h4>{editingItem ? 'Edit' : 'Add'} {activeTab === 'authors' ? 'Author' : 'Genre'}</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)}
                  style={{marginLeft: '10px'}}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <DataTable
            columns={columns}
            data={activeTab === 'authors' ? authors : genres}
            pagination
            paginationPerPage={10}
            progressPending={loading}
            highlightOnHover
            striped
            responsive
            noDataComponent={`No ${activeTab} found`}
          />
        </div>
      </div>
    </div>
  );
}