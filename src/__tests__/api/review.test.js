import * as reviewAPI from '../../api/review';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Review API', () => {
  const mockReviews = [
    { id: 1, review_text: 'Great book!', rating: 5, user_id: 1 },
    { id: 2, review_text: 'Good read', rating: 4, user_id: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReviews', () => {
    test('fetches reviews for a book successfully', async () => {
      api.get.mockResolvedValue({ data: mockReviews });

      const result = await reviewAPI.getReviews(1);

      expect(api.get).toHaveBeenCalledWith('/books/1/reviews');
      expect(result.data).toEqual(mockReviews);
    });

    test('handles empty reviews list', async () => {
      api.get.mockResolvedValue({ data: [] });

      const result = await reviewAPI.getReviews(1);

      expect(result.data).toEqual([]);
    });

    test('handles API error', async () => {
      api.get.mockRejectedValue({ response: { status: 404 } });

      await expect(reviewAPI.getReviews(1)).rejects.toBeDefined();
    });
  });

  describe('addReview', () => {
    test('adds review successfully', async () => {
      const reviewData = { review_text: 'Amazing book!', rating: 5, user_id: 1 };
      api.post.mockResolvedValue({ data: { id: 3, ...reviewData } });

      const result = await reviewAPI.addReview(1, reviewData);

      expect(api.post).toHaveBeenCalledWith('/books/1/reviews', reviewData);
      expect(result.data).toHaveProperty('id');
      expect(result.data.review_text).toBe('Amazing book!');
    });

    test('handles validation error', async () => {
      const reviewData = { review_text: '', rating: 5 };
      api.post.mockRejectedValue({ response: { status: 400, data: { detail: 'Review text is required' } } });

      await expect(reviewAPI.addReview(1, reviewData)).rejects.toBeDefined();
    });

    test('handles unauthorized error', async () => {
      const reviewData = { review_text: 'Test', rating: 5 };
      api.post.mockRejectedValue({ response: { status: 401 } });

      await expect(reviewAPI.addReview(1, reviewData)).rejects.toBeDefined();
    });
  });
});
