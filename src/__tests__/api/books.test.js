import * as booksAPI from '../../api/books';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Books API', () => {
  const mockBooks = [
    { id: 1, title: 'Book 1', author_id: 1, genre_id: 1 },
    { id: 2, title: 'Book 2', author_id: 2, genre_id: 2 },
  ];

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
  });

  describe('getBooks', () => {
    test('fetches books successfully', async () => {
      api.get.mockResolvedValue({ data: mockBooks });

      const result = await booksAPI.getBooks();

      expect(api.get).toHaveBeenCalledWith('/books');
      expect(result.data).toEqual(mockBooks);
    });

    test('returns mock data on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await booksAPI.getBooks();

      expect(result.data).toBeDefined();
    });
  });

  describe('getBookById', () => {
    test('fetches book by id successfully', async () => {
      const mockBook = mockBooks[0];
      api.get.mockResolvedValue({ data: mockBook });

      const result = await booksAPI.getBookById(1);

      expect(api.get).toHaveBeenCalledWith('/books/1');
      expect(result.data).toEqual(mockBook);
    });
  });

  describe('addBook', () => {
    test('creates new book successfully', async () => {
      const newBook = { title: 'New Book', author_id: 1, genre_id: 1 };
      api.post.mockResolvedValue({ data: { id: 3, ...newBook } });

      const result = await booksAPI.addBook(newBook);

      expect(api.post).toHaveBeenCalledWith('/books', newBook);
      expect(result.data).toHaveProperty('id');
    });

    test('returns mock data on network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await booksAPI.addBook({ title: 'Test' });

      expect(result.data).toBeDefined();
    });
  });

  describe('updateBook', () => {
    test('updates book successfully', async () => {
      const updateData = { title: 'Updated Book' };
      api.put.mockResolvedValue({ data: { id: 1, ...updateData } });

      const result = await booksAPI.updateBook(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/books/1', updateData);
      expect(result.data).toHaveProperty('id', 1);
    });

    test('returns mock data on network error', async () => {
      api.put.mockRejectedValue({ message: 'Network Error' });

      const result = await booksAPI.updateBook(1, { title: 'Updated' });

      expect(result.data).toBeDefined();
    });
  });

  describe('deleteBook', () => {
    test('deletes book successfully', async () => {
      api.delete.mockResolvedValue({ data: { message: 'Deleted' } });

      const result = await booksAPI.deleteBook(1);

      expect(api.delete).toHaveBeenCalledWith('/books/1');
      expect(result.data).toBeDefined();
    });

    test('returns mock data on network error', async () => {
      api.delete.mockRejectedValue({ message: 'Network Error' });

      const result = await booksAPI.deleteBook(1);

      expect(result.data).toBeDefined();
    });
  });

  describe('getDropdownAuthors', () => {
    test('fetches dropdown authors successfully', async () => {
      api.get.mockResolvedValue({ data: mockAuthors });

      const result = await booksAPI.getDropdownAuthors();

      expect(api.get).toHaveBeenCalledWith('/books/dropdown/authors');
      expect(result.data).toEqual(mockAuthors);
    });
  });

  describe('getDropdownGenres', () => {
    test('fetches dropdown genres successfully', async () => {
      api.get.mockResolvedValue({ data: mockGenres });

      const result = await booksAPI.getDropdownGenres();

      expect(api.get).toHaveBeenCalledWith('/books/dropdown/genres');
      expect(result.data).toEqual(mockGenres);
    });
  });

  describe('createAuthor', () => {
    test('creates new author successfully', async () => {
      const newAuthor = { name: 'New Author' };
      api.post.mockResolvedValue({ data: { id: 3, ...newAuthor } });

      const result = await booksAPI.createAuthor(newAuthor);

      expect(api.post).toHaveBeenCalledWith('/authors', newAuthor);
      expect(result.data).toHaveProperty('id');
    });
  });

  describe('createGenre', () => {
    test('creates new genre successfully', async () => {
      const newGenre = { name: 'New Genre' };
      api.post.mockResolvedValue({ data: { id: 3, ...newGenre } });

      const result = await booksAPI.createGenre(newGenre);

      expect(api.post).toHaveBeenCalledWith('/genres', newGenre);
      expect(result.data).toHaveProperty('id');
    });
  });

  describe('generateSummary', () => {
    test('generates summary successfully', async () => {
      api.post.mockResolvedValue({ data: { message: 'Summary generated' } });

      const result = await booksAPI.generateSummary(1);

      expect(api.post).toHaveBeenCalledWith('/books/1/generate-summary');
      expect(result.data).toHaveProperty('message');
    });
  });

  describe('getBookSummary', () => {
    test('fetches book summary successfully', async () => {
      const mockSummary = { summary: 'Test summary' };
      api.get.mockResolvedValue({ data: mockSummary });

      const result = await booksAPI.getBookSummary(1);

      expect(api.get).toHaveBeenCalledWith('/books/1/summary');
      expect(result.data).toHaveProperty('summary');
    });
  });
});
