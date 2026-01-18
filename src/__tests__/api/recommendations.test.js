import * as recommendationsAPI from '../../api/recommendations';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Recommendations API', () => {
  const mockRecommendations = [
    { id: 1, title: 'Recommended Book 1', author: 'Author 1', score: 0.95 },
    { id: 2, title: 'Recommended Book 2', author: 'Author 2', score: 0.87 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    test('fetches recommendations successfully without params', async () => {
      api.get.mockResolvedValue({ data: mockRecommendations });

      const result = await recommendationsAPI.getRecommendations();

      expect(api.get).toHaveBeenCalledWith('/recommendations', { params: undefined });
      expect(result.data).toEqual(mockRecommendations);
    });

    test('fetches recommendations with params', async () => {
      const params = { limit: 10, user_id: 1 };
      api.get.mockResolvedValue({ data: mockRecommendations });

      const result = await recommendationsAPI.getRecommendations(params);

      expect(api.get).toHaveBeenCalledWith('/recommendations', { params });
      expect(result.data).toEqual(mockRecommendations);
    });

    test('handles empty recommendations', async () => {
      api.get.mockResolvedValue({ data: [] });

      const result = await recommendationsAPI.getRecommendations();

      expect(result.data).toEqual([]);
    });

    test('handles API error', async () => {
      api.get.mockRejectedValue({ response: { status: 500 } });

      await expect(recommendationsAPI.getRecommendations()).rejects.toBeDefined();
    });

    test('handles network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      await expect(recommendationsAPI.getRecommendations()).rejects.toBeDefined();
    });
  });
});
