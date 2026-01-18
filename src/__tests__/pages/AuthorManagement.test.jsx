import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthorManagement from '../../pages/AuthorManagement';
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

describe('AuthorManagement Component', () => {
  const mockAuthors = [
    { id: 1, name: 'Author 1' },
    { id: 2, name: 'Author 2' },
  ];

  const mockGenres = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    booksAPI.getAuthors.mockResolvedValue({ data: mockAuthors });
    booksAPI.getGenres.mockResolvedValue({ data: mockGenres });
    window.confirm = jest.fn(() => true);
  });

  test('renders author management page', async () => {
    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText(/authors management/i)).toBeInTheDocument();
    });
  });

  test('loads authors and genres on mount', async () => {
    render(<AuthorManagement />);

    await waitFor(() => {
      expect(booksAPI.getAuthors).toHaveBeenCalled();
      expect(booksAPI.getGenres).toHaveBeenCalled();
    });
  });

  test('switches between authors and genres tabs', async () => {
    const user = userEvent.setup();
    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText(/authors/i)).toBeInTheDocument();
    });

    const genresTab = screen.getByText(/genres/i);
    await user.click(genresTab);

    await waitFor(() => {
      expect(screen.getByText(/add genre/i)).toBeInTheDocument();
    });
  });

  test('shows add form when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText(/add author/i)).toBeInTheDocument();
    });

    const addButton = screen.getByText(/add author/i);
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });
  });

  test('creates new author', async () => {
    const user = userEvent.setup();
    booksAPI.createAuthor.mockResolvedValue({ data: { id: 3, name: 'New Author' } });

    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText(/add author/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add author/i));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/name/i), 'New Author');
    await user.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(booksAPI.createAuthor).toHaveBeenCalledWith({ name: 'New Author' });
    });
  });

  test('edits existing author', async () => {
    const user = userEvent.setup();
    booksAPI.updateAuthor.mockResolvedValue({ data: { id: 1, name: 'Updated Author' } });

    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText('Author 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText(/edit/i);
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Author 1')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Author 1');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Author');
    await user.click(screen.getByText(/update/i));

    await waitFor(() => {
      expect(booksAPI.updateAuthor).toHaveBeenCalledWith(1, { name: 'Updated Author' });
    });
  });

  test('deletes author after confirmation', async () => {
    const user = userEvent.setup();
    booksAPI.deleteAuthor.mockResolvedValue({});

    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText('Author 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(booksAPI.deleteAuthor).toHaveBeenCalled();
    });
  });

  test('cancels form when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthorManagement />);

    await waitFor(() => {
      expect(screen.getByText(/add author/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add author/i));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/cancel/i));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/name/i)).not.toBeInTheDocument();
    });
  });
});
