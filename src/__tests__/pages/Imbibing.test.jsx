import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Imbibing from '../../pages/Imbibing';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Imbibing Component', () => {
  const mockDocuments = [
    { id: 1, filename: 'test.pdf', uploaded_at: '2024-01-01' },
    { id: 2, filename: 'document.docx', uploaded_at: '2024-01-02' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('renders imbibing page', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByText(/data imbibing/i)).toBeInTheDocument();
    });
  });

  test('loads documents and stats on mount', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/documents');
    });
  });

  test('displays statistics', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByText(/total documents/i)).toBeInTheDocument();
      expect(screen.getByText(/processed today/i)).toBeInTheDocument();
      expect(screen.getByText(/failed jobs/i)).toBeInTheDocument();
    });
  });

  test('starts imbibing for selected document', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });
    api.post.mockResolvedValue({ data: { job_id: '123' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const select = document.querySelector('select');
    await user.selectOptions(select, '1');
    await user.click(screen.getByRole('button', { name: /start imbibing/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/imbibing/trigger/1');
    });
  });

  test('shows alert when no document is selected', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start imbibing/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /start imbibing/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please select a document to ingest');
    });
  });

  test('displays loading state during imbibing', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const select = document.querySelector('select');
    await user.selectOptions(select, '1');
    await user.click(screen.getByRole('button', { name: /start imbibing/i }));

    await waitFor(() => {
      expect(screen.getByText(/starting/i)).toBeInTheDocument();
    });
  });

  test('displays recent jobs', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });
    api.get.mockResolvedValueOnce({ data: mockDocuments })
         .mockResolvedValueOnce({ data: { today_processed: 5 } })
         .mockResolvedValue({ data: { status: 'completed' } });

    render(<Imbibing />);

    await waitFor(() => {
      expect(screen.getByText(/recent jobs/i)).toBeInTheDocument();
    });
  });
});
