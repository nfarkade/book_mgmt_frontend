import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import api from "../api/axios";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    console.log('Attempting to load documents from: GET /documents');
    try {
      const response = await api.get("/documents");
      console.log('Success! Full response:', response);
      console.log('Response data:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log('=== DOCUMENT RESPONSE DEBUG ===');
        response.data.forEach((doc, index) => {
          console.log(`Document ${index} FULL OBJECT:`, JSON.stringify(doc, null, 2));
          console.log(`Document ${index} KEYS:`, Object.keys(doc));
          console.log(`Document ${index} VALUES:`, Object.values(doc));
        });
        console.log('=== END DEBUG ===');
      }
      
      setDocuments(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Documents API failed:', error);
      setError(`Failed to load documents: ${error.response?.status || 'Network Error'}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${id}`);
        await loadDocuments();
        alert('Document deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert(`Delete failed: ${error.response?.status || 'Network Error'}`);
      }
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await api.get(`/documents/${id}/download`, { 
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = name || `document-${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.response?.status || 'Network Error'}`);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }
    
    console.log('Attempting to upload file to: POST /documents/upload');
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      const response = await api.post("/documents/upload", formData);
      console.log('Upload success:', response.data);
      
      setUploadFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      await loadDocuments();
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.response?.status || 'Network Error'} - ${error.response?.data?.detail || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      name: 'Document Name',
      selector: row => row.filename || 'Unknown',
      sortable: true,
      minWidth: '200px',
    },
    {
      name: 'Size',
      selector: row => {
        const size = row.file_size;
        if (size === "Unknown" || size === null || size === undefined) {
          return 'Unknown';
        }
        if (typeof size === 'number') {
          if (size > 1024 * 1024) {
            return `${(size / 1024 / 1024).toFixed(1)} MB`;
          } else if (size > 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
          } else {
            return `${size} bytes`;
          }
        }
        return size.toString();
      },
      sortable: true,
      width: '120px',
    },
    {
      name: 'Date',
      selector: row => {
        const date = row.uploaded_at;
        if (!date) {
          return 'Unknown';
        }
        try {
          return new Date(date).toLocaleDateString();
        } catch (error) {
          return date.toString();
        }
      },
      sortable: true,
      width: '120px',
    },
    {
      name: 'Status',
      selector: row => row.status || row.state || 'Active',
      sortable: true,
      width: '100px',
      cell: row => (
        <span className={`status-badge ${(row.status || 'active').toLowerCase()}`}>
          {row.status || 'Active'}
        </span>
      ),
    },
    {
      name: 'Actions',
      width: '180px',
      cell: row => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => handleDownload(row.id, row.name || row.filename)}
          >
            Download
          </button>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="page-header">
            <h2>Document Management</h2>
          </div>
          
          <div style={{padding: '20px', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', margin: '20px 0'}}>
            <h4>Backend Connection Error</h4>
            <p><strong>Error:</strong> {error}</p>
            <p><strong>Required Backend Endpoints:</strong></p>
            <ul>
              <li><code>GET /documents</code> - List documents</li>
              <li><code>POST /documents/upload</code> - Upload files</li>
              <li><code>DELETE /documents/&#123;id&#125;</code> - Delete documents</li>
            </ul>
            <p>Please ensure your backend server is running on <code>http://127.0.0.1:8000</code> with these endpoints implemented.</p>
            <button className="btn btn-primary" onClick={loadDocuments}>
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h2>Document Management</h2>
        </div>
        
        <div className="upload-section">
          <h3>Upload Document</h3>
          <form onSubmit={handleFileUpload}>
            <div className="file-input-wrapper">
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="file-input"
                disabled={uploading}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={uploading || !uploadFile}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {uploadFile && (
              <p style={{marginTop: '8px', color: '#666', fontSize: '14px'}}>
                Selected: {uploadFile.name}
              </p>
            )}
          </form>
        </div>

        <DataTable
          columns={columns}
          data={documents}
          pagination
          paginationPerPage={10}
          progressPending={loading}
          highlightOnHover
          striped
          responsive
          noDataComponent="No documents found. Upload a document to get started."
        />
      </div>
    </div>
  );
}