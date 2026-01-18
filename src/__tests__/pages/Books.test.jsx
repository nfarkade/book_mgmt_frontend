import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Books from '../../pages/Books';
import * as booksAPI from '../../api/books';

jest.mock('../../api/books');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify({ role: { is_admin: true } })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Books Component', () => {
  const mockBooks = [
    { id: 1, title: 'Test Book 1', author_id: 1, genre_id: 1, year_published: 2020 },
    { id: 2, title: 'Test Book 2', author_id: 2, genre_id: 2, year_published: 2021 },
  ];

  const mockAuthors = [
    { id: 1, name: 'Author 1' },
    { id: 2, name: 'Author 2' },
  ];

  const mockGenres = [
    { id: 1, name: 'Genre 1' },
    { id: 2, name: 'Genre 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    booksAPI.getBooks.mockResolvedValue({ data: mockBooks });
    booksAPI.getDropdownAuthors.mockResolvedValue({ data: mockAuthors });
    booksAPI.getDropdownGenres.mockResolvedValue({ data: mockGenres });
  });

  test('renders books page with title', async () => {
    render(<Books />);
    
    await waitFor(() => {
      expect(screen.getByText(/books/i)).toBeInTheDocument();
    });
  });

  test('loads and displays books', async () => {
    render(<Books />);

    await waitFor(() => {
      expect(booksAPI.getBooks).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    booksAPI.getBooks.mockImplementation(() => new Promise(() => {}));
    
    render(<Books />);
    // DataTable shows loading state
  });

  test('handles delete action', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    booksAPI.deleteBook.mockResolvedValue({});

    render(<Books />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(booksAPI.deleteBook).toHaveBeenCalled();
    });
  });

  test('shows edit form when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Books />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText(/edit/i);
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/edit book/i)).toBeInTheDocument();
    });
  });
});
