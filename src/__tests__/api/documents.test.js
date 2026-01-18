import * as documentsAPI from '../../api/documents';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Documents API', () => {
  const mockDocuments = [
    { id: 1, name: 'document1.pdf', size: '2.5 MB', uploadDate: '2024-01-15', status: 'Processed' },
    { id: 2, name: 'document2.docx', size: '1.2 MB', uploadDate: '2024-01-14', status: 'Processing' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocuments', () => {
    test('fetches documents successfully', async () => {
      api.get.mockResolvedValue({ data: mockDocuments });

      const result = await documentsAPI.getDocuments();

      expect(api.get).toHaveBeenCalledWith('/documents');
      expect(result.data).toEqual(mockDocuments);
    });

    test('returns mock data on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.getDocuments();

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('returns mock data on 500 error', async () => {
      api.get.mockRejectedValue({ response: { status: 500 } });

      const result = await documentsAPI.getDocuments();

      expect(result.data).toBeDefined();
    });
  });

  describe('uploadDocument', () => {
    test('uploads document successfully', async () => {
      const formData = new FormData();
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      formData.append('file', file);

      api.post.mockResolvedValue({ data: { id: 3, name: 'test.pdf' } });

      const result = await documentsAPI.uploadDocument(formData);

      expect(api.post).toHaveBeenCalledWith('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(result.data).toBeDefined();
    });

    test('returns mock data on network error', async () => {
      const formData = new FormData();
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      formData.append('file', file);

      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.uploadDocument(formData);

      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('id');
    });

    test('handles missing file in formData', async () => {
      const formData = new FormData();
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.uploadDocument(formData);

      expect(result.data).toBeDefined();
    });
  });

  describe('deleteDocument', () => {
    test('deletes document successfully', async () => {
      api.delete.mockResolvedValue({ data: { message: 'Document deleted successfully' } });

      const result = await documentsAPI.deleteDocument(1);

      expect(api.delete).toHaveBeenCalledWith('/documents/1');
      expect(result.data).toHaveProperty('message');
    });

    test('returns mock data on network error', async () => {
      api.delete.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.deleteDocument(1);

      expect(result.data).toBeDefined();
    });

    test('handles non-existent document id', async () => {
      api.delete.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.deleteDocument(999);

      expect(result.data).toBeDefined();
    });
  });

  describe('downloadDocument', () => {
    test('downloads document successfully', async () => {
      const blob = new Blob(['content'], { type: 'application/pdf' });
      api.get.mockResolvedValue({ data: blob });

      const result = await documentsAPI.downloadDocument(1);

      expect(api.get).toHaveBeenCalledWith('/documents/1/download', { responseType: 'blob' });
      expect(result.data).toBeInstanceOf(Blob);
    });

    test('returns mock blob on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await documentsAPI.downloadDocument(1);

      expect(result.data).toBeInstanceOf(Blob);
    });

    test('handles 404 error', async () => {
      api.get.mockRejectedValue({ response: { status: 404 } });

      const result = await documentsAPI.downloadDocument(999);

      expect(result.data).toBeInstanceOf(Blob);
    });
  });
});
