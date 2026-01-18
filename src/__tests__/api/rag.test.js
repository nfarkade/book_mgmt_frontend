import * as ragAPI from '../../api/rag';
import api from '../../api/axios';

jest.mock('../../api/axios');

describe('RAG API', () => {
  const mockSearchResults = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      content: 'Machine learning is a subset of artificial intelligence',
      source: 'ml_textbook.pdf',
      score: 0.95,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchRAG', () => {
    test('searches RAG successfully with query', async () => {
      api.post.mockResolvedValue({ data: mockSearchResults });

      const result = await ragAPI.searchRAG('machine learning');

      expect(api.post).toHaveBeenCalledWith('/rag/search', {
        query: 'machine learning',
        max_results: 10,
        threshold: 0.7,
      });
      expect(result.data).toEqual(mockSearchResults);
    });

    test('searches RAG with custom options', async () => {
      api.post.mockResolvedValue({ data: mockSearchResults });

      const options = { maxResults: 5, threshold: 0.8 };
      const result = await ragAPI.searchRAG('test query', options);

      expect(api.post).toHaveBeenCalledWith('/rag/search', {
        query: 'test query',
        max_results: 5,
        threshold: 0.8,
      });
      expect(result.data).toBeDefined();
    });

    test('returns mock data on network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await ragAPI.searchRAG('test');

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('returns mock data on 500 error', async () => {
      api.post.mockRejectedValue({ response: { status: 500 } });

      const result = await ragAPI.searchRAG('test');

      expect(result.data).toBeDefined();
    });
  });

  describe('generateAnswer', () => {
    test('generates answer successfully', async () => {
      const query = 'What is machine learning?';
      const context = [{ source: 'ml_textbook.pdf', content: 'ML is...' }];
      const mockAnswer = {
        answer: 'Based on the provided context...',
        sources: ['ml_textbook.pdf'],
        confidence: 0.85,
      };

      api.post.mockResolvedValue({ data: mockAnswer });

      const result = await ragAPI.generateAnswer(query, context);

      expect(api.post).toHaveBeenCalledWith('/rag/generate', { query, context });
      expect(result.data).toHaveProperty('answer');
      expect(result.data).toHaveProperty('sources');
      expect(result.data).toHaveProperty('confidence');
    });

    test('returns mock data on network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await ragAPI.generateAnswer('test', []);

      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('answer');
    });
  });

  describe('getRAGStats', () => {
    test('fetches RAG stats successfully', async () => {
      const mockStats = {
        total_documents: 1234,
        indexed_documents: 1200,
        total_embeddings: 45678,
        last_updated: '2024-01-01T00:00:00Z',
        index_status: 'healthy',
      };

      api.get.mockResolvedValue({ data: mockStats });

      const result = await ragAPI.getRAGStats();

      expect(api.get).toHaveBeenCalledWith('/rag/stats');
      expect(result.data).toEqual(mockStats);
      expect(result.data).toHaveProperty('total_documents');
      expect(result.data).toHaveProperty('index_status');
    });

    test('returns mock data on network error', async () => {
      api.get.mockRejectedValue({ message: 'Network Error' });

      const result = await ragAPI.getRAGStats();

      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('total_documents');
    });
  });

  describe('rebuildIndex', () => {
    test('triggers index rebuild successfully', async () => {
      const mockResponse = {
        message: 'Index rebuild started',
        job_id: 'rebuild_123',
        estimated_time: '5-10 minutes',
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await ragAPI.rebuildIndex();

      expect(api.post).toHaveBeenCalledWith('/rag/rebuild-index');
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('job_id');
    });

    test('returns mock data on network error', async () => {
      api.post.mockRejectedValue({ message: 'Network Error' });

      const result = await ragAPI.rebuildIndex();

      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('message');
    });
  });
});
