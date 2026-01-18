import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RAGSearch from '../../pages/RAGSearch';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('RAGSearch Component', () => {
  const mockSearchResults = {
    query: 'test query',
    results: [
      {
        book_id: 1,
        similarity_score: 0.95,
        content: 'Test content',
        metadata: {
          title: 'Test Book',
          author: 'Test Author',
          genre: 'Fiction',
          book_id: 1,
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('renders RAG search page', () => {
    render(<RAGSearch />);

    expect(screen.getByText(/rag search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your search query/i)).toBeInTheDocument();
  });

  test('updates query input', async () => {
    const user = userEvent.setup();
    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  test('performs search on form submit', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: mockSearchResults });

    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('/search'),
        undefined
      );
    });
  });

  test('displays search results', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: mockSearchResults });

    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  test('shows loading state during search', async () => {
    const user = userEvent.setup();
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });
  });

  test('shows alert when query is empty', async () => {
    const user = userEvent.setup();
    render(<RAGSearch />);

    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please enter a search query');
    });
  });

  test('handles search error', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue({ response: { status: 500, data: { detail: 'Server error' } } });

    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });

  test('displays no results message', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { query: 'test', results: [] } });

    render(<RAGSearch />);

    const searchInput = screen.getByPlaceholderText(/enter your search query/i);
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });
});
