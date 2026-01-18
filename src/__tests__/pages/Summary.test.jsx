import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Summary from '../../pages/Summary';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Summary Component', () => {
  const mockDocuments = [
    { id: 1, filename: 'test.pdf' },
    { id: 2, filename: 'document.docx' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('renders summary page', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByText(/document summary generator/i)).toBeInTheDocument();
    });
  });

  test('loads documents on mount', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Summary />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/documents');
    });
  });

  test('displays document dropdown', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('document.docx')).toBeInTheDocument();
    });
  });

  test('generates summary for selected document', async () => {
    const user = userEvent.setup();
    const mockSummary = { summary: 'This is a test summary' };

    api.get.mockResolvedValue({ data: mockDocuments });
    api.post.mockResolvedValue({ data: mockSummary });

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const select = screen.getByLabelText(/select document/i);
    await user.selectOptions(select, '1');
    await user.click(screen.getByRole('button', { name: /generate summary/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/documents/1/summary');
      expect(screen.getByText('This is a test summary')).toBeInTheDocument();
    });
  });

  test('shows alert when no document is selected', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate summary/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /generate summary/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please select a document');
    });
  });

  test('displays loading state during summary generation', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const select = screen.getByLabelText(/select document/i);
    await user.selectOptions(select, '1');
    await user.click(screen.getByRole('button', { name: /generate summary/i }));

    await waitFor(() => {
      expect(screen.getByText(/generating summary/i)).toBeInTheDocument();
    });
  });

  test('disables generate button when no document selected', async () => {
    api.get.mockResolvedValue({ data: mockDocuments });

    render(<Summary />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /generate summary/i });
      expect(button).toBeDisabled();
    });
  });

  test('handles API error gracefully', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: mockDocuments });
    api.post.mockRejectedValue({ response: { status: 500 } });

    render(<Summary />);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const select = screen.getByLabelText(/select document/i);
    await user.selectOptions(select, '1');
    await user.click(screen.getByRole('button', { name: /generate summary/i }));

    await waitFor(() => {
      expect(screen.queryByText(/generated summary/i)).not.toBeInTheDocument();
    });
  });
});
