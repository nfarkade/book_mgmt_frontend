import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AddBook from '../../pages/AddBook';
import * as booksAPI from '../../api/books';

jest.mock('../../api/books');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('AddBook Component', () => {
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
    booksAPI.getDropdownAuthors.mockResolvedValue({ data: mockAuthors });
    booksAPI.getDropdownGenres.mockResolvedValue({ data: mockGenres });
  });

  test('renders add book form', async () => {
    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/add book/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
  });

  test('loads authors and genres on mount', async () => {
    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(booksAPI.getDropdownAuthors).toHaveBeenCalled();
      expect(booksAPI.getDropdownGenres).toHaveBeenCalled();
    });
  });

  test('updates form fields on input', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Book');

    expect(titleInput).toHaveValue('Test Book');
  });

  test('shows new author input when "Add New Author" is selected', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    });

    const authorSelect = screen.getByLabelText(/author/i);
    await user.selectOptions(authorSelect, 'new');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter new author name/i)).toBeInTheDocument();
    });
  });

  test('shows new genre input when "Add New Genre" is selected', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    });

    const genreSelect = screen.getByLabelText(/genre/i);
    await user.selectOptions(genreSelect, 'new');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter new genre name/i)).toBeInTheDocument();
    });
  });

  test('creates new author when submitting with new author', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    booksAPI.createAuthor.mockResolvedValue({ data: { id: 3 } });
    booksAPI.addBook.mockResolvedValue({ data: { id: 1 } });

    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/title/i), 'New Book');
    await user.selectOptions(screen.getByLabelText(/author/i), 'new');
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter new author name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/enter new author name/i), 'New Author');
    await user.click(screen.getByRole('button', { name: /save book/i }));

    await waitFor(() => {
      expect(booksAPI.createAuthor).toHaveBeenCalledWith({ name: 'New Author' });
    });
  });

  test('shows alert when title is missing', async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();

    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save book/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /save book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Title and Author are required');
    });
  });

  test('disables submit button while loading', async () => {
    const user = userEvent.setup();
    booksAPI.addBook.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <AddBook />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/title/i), 'Test Book');
    await user.selectOptions(screen.getByLabelText(/author/i), '1');
    await user.click(screen.getByRole('button', { name: /save book/i }));

    await waitFor(() => {
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });
});
