import * as imbibingAPI from '../../api/imbibing';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('Imbibing API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runImbibing', () => {
    test('triggers imbibing successfully', async () => {
      const mockResponse = { message: 'Imbibing started', job_id: 'job_123' };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await imbibingAPI.runImbibing();

      expect(api.post).toHaveBeenCalledWith('/imbibing/run');
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('job_id');
    });

    test('handles API error', async () => {
      api.post.mockRejectedValue({ response: { status: 500 } });

      await expect(imbibingAPI.runImbibing()).rejects.toBeDefined();
    });

    test('handles network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      await expect(imbibingAPI.runImbibing()).rejects.toBeDefined();
    });
  });

  describe('getImbibingStatus', () => {
    test('fetches imbibing status successfully', async () => {
      const mockStatus = {
        status: 'running',
        progress: 75,
        documents_processed: 100,
        total_documents: 150,
      };

      api.get.mockResolvedValue({ data: mockStatus });

      const result = await imbibingAPI.getImbibingStatus();

      expect(api.get).toHaveBeenCalledWith('/imbibing/status');
      expect(result.data).toEqual(mockStatus);
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('progress');
    });

    test('handles empty status', async () => {
      api.get.mockResolvedValue({ data: {} });

      const result = await imbibingAPI.getImbibingStatus();

      expect(result.data).toEqual({});
    });

    test('handles API error', async () => {
      api.get.mockRejectedValue({ response: { status: 404 } });

      await expect(imbibingAPI.getImbibingStatus()).rejects.toBeDefined();
    });

    test('handles network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      await expect(imbibingAPI.getImbibingStatus()).rejects.toBeDefined();
    });
  });
});
