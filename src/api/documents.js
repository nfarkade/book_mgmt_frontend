import api from "./axios";

// Mock data for development
const mockDocuments = [
  { id: 1, name: "document1.pdf", size: "2.5 MB", uploadDate: "2024-01-15", status: "Processed" },
  { id: 2, name: "document2.docx", size: "1.2 MB", uploadDate: "2024-01-14", status: "Processing" },
  { id: 3, name: "document3.txt", size: "0.5 MB", uploadDate: "2024-01-13", status: "Failed" }
];

let nextId = 4;

const handleApiError = async (apiCall, mockResponse) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || 
        error.response?.status === 500 || error.response?.status === 404 || error.response?.status === 403) {
      console.warn('Backend not available, using mock data');
      return { data: mockResponse };
    }
    throw error;
  }
};

export const getDocuments = () => handleApiError(
  () => api.get("/documents"),
  mockDocuments
);

export const uploadDocument = (formData) => handleApiError(
  () => api.post("/documents/upload", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  (() => {
    const file = formData.get('file');
    const newDoc = {
      id: nextId++,
      name: file?.name || 'uploaded-file.pdf',
      size: file?.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '1.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Processing'
    };
    mockDocuments.push(newDoc);
    return newDoc;
  })()
);

export const deleteDocument = (id) => handleApiError(
  () => api.delete(`/documents/${id}`),
  (() => {
    const index = mockDocuments.findIndex(doc => doc.id === parseInt(id));
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return { message: 'Document deleted successfully' };
    }
    return null;
  })()
);

export const downloadDocument = (id) => handleApiError(
  () => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  (() => {
    // For mock, return the blob in the expected format
    return new Blob(['Mock file content for document'], { type: 'application/pdf' });
  })()
);