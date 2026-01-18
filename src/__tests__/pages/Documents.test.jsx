import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Documents from '../../pages/Documents';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Documents Component', () => {
  const mockDocuments = [
    { id: 1, filename: 'test.pdf', file_size: 1024, uploaded_at: '2024-01-01', status: 'active' },
    { id: 2, filename: 'document.docx', file_size: 2048, uploaded_at: '2024-01-02', status: 'active' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  test('renders documents page', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText(/document management/i)).toBeInTheDocument();
    });
  });

  test('loads documents on mount', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Documents />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/documents');
    });
  });

  test('displays documents in table', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('document.docx')).toBeInTheDocument();
    });
  });

  test('handles file upload', async () => {
    const user = userEvent.setup();
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    
    api.get.mockResolvedValue({ data: mockDocuments });
    api.post.mockResolvedValue({ data: { id: 3, filename: 'test.pdf' } });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText(/upload document/i)).toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    await user.upload(fileInput, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  test('deletes document after confirmation', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.delete.mockResolvedValue({});

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/documents/1');
    });
  });

  test('downloads document', async () => {
    const user = userEvent.setup();
    const blob = new Blob(['content'], { type: 'application/pdf' });
    
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: blob });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const downloadButtons = screen.getAllByText(/download/i);
    await user.click(downloadButtons[0]);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/documents/1/download', { responseType: 'blob' });
    });
  });

  test('displays error message when API fails', async () => {
    api.get.mockRejectedValue({ message: 'Network Error' });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText(/backend connection error/i)).toBeInTheDocument();
    });
  });

  test('shows retry button on error', async () => {
    api.get.mockRejectedValue({ message: 'Network Error' });

    render(<Documents />);

    await waitFor(() => {
      expect(screen.getByText(/retry connection/i)).toBeInTheDocument();
    });
  });
});
