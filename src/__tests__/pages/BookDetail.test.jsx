import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import BookDetail from '../../pages/BookDetail';
import api from '../../api/axios';

jest.mock('../../api/axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('BookDetail Component', () => {
  const mockBook = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    year_published: 2020,
    summary: 'Test summary',
  };

  const mockReviews = [
    { id: 1, review_text: 'Great book!', rating: 5 },
    { id: 2, review_text: 'Good read', rating: 4 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  test('renders book details', async () => {
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Fiction')).toBeInTheDocument();
    });
  });

  test('loads book and reviews on mount', async () => {
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/books/1');
      expect(api.get).toHaveBeenCalledWith('/books/1/reviews');
    });
  });

  test('displays book summary', async () => {
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test summary')).toBeInTheDocument();
    });
  });

  test('displays reviews', async () => {
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Great book!')).toBeInTheDocument();
      expect(screen.getByText('Good read')).toBeInTheDocument();
    });
  });

  test('generates AI summary', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });
    api.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/generate ai summary/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/generate ai summary/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/books/1/generate-summary');
    });
  });

  test('submits review', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });
    api.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write your review/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await user.type(textarea, 'Amazing book!');
    await user.click(screen.getByText(/submit review/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/books/1/reviews', expect.objectContaining({
        review_text: 'Amazing book!',
      }));
    });
  });

  test('deletes book after confirmation', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });
    api.delete.mockResolvedValue({});

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/delete book/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/delete book/i));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/books/1');
    });
  });

  test('shows loading state while generating summary', async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: mockBook })
         .mockResolvedValueOnce({ data: mockReviews });
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <BookDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/generate ai summary/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/generate ai summary/i));

    await waitFor(() => {
      expect(screen.getByText(/generating/i)).toBeInTheDocument();
    });
  });
});
