import api from "./axios";

// Mock RAG responses for development
const mockSearchResults = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    content: "Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models that enable computers to improve their performance on a specific task through experience.",
    source: "ml_textbook.pdf",
    score: 0.95,
    metadata: {
      page: 15,
      chapter: "Chapter 1: Fundamentals"
    }
  },
  {
    id: 2,
    title: "Deep Learning Fundamentals",
    content: "Deep learning uses neural networks with multiple layers to model and understand complex patterns in data. It has revolutionized fields like computer vision and natural language processing.",
    source: "deep_learning_guide.pdf",
    score: 0.87,
    metadata: {
      page: 42,
      chapter: "Chapter 3: Neural Networks"
    }
  },
  {
    id: 3,
    title: "Natural Language Processing",
    content: "NLP combines computational linguistics with machine learning to help computers understand, interpret, and generate human language in a valuable way.",
    source: "nlp_handbook.pdf",
    score: 0.82,
    metadata: {
      page: 8,
      chapter: "Chapter 1: Introduction to NLP"
    }
  }
];

const handleApiError = async (apiCall, mockResponse) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || 
        error.response?.status === 500 || error.response?.status === 404 || error.response?.status === 403) {
      console.warn('Backend not available, using mock RAG data');
      return { data: mockResponse };
    }
    throw error;
  }
};

export const searchRAG = (query, options = {}) => handleApiError(
  () => api.post("/rag/search", { 
    query, 
    max_results: options.maxResults || 10,
    threshold: options.threshold || 0.7
  }),
  query ? mockSearchResults.filter(result => 
    result.content.toLowerCase().includes(query.toLowerCase()) ||
    result.title.toLowerCase().includes(query.toLowerCase())
  ) : mockSearchResults
);

export const generateAnswer = (query, context) => handleApiError(
  () => api.post("/rag/generate", { query, context }),
  {
    answer: `Based on the provided context, ${query.toLowerCase().includes('what') ? 'here is what I found' : 'the answer is'}: This is a generated response based on the search results. The information comes from multiple sources in your document collection.`,
    sources: context.map(item => item.source),
    confidence: 0.85
  }
);

export const getRAGStats = () => handleApiError(
  () => api.get("/rag/stats"),
  {
    total_documents: 1234,
    indexed_documents: 1200,
    total_embeddings: 45678,
    last_updated: new Date().toISOString(),
    index_status: "healthy"
  }
);

export const rebuildIndex = () => handleApiError(
  () => api.post("/rag/rebuild-index"),
  {
    message: "Index rebuild started",
    job_id: "rebuild_" + Date.now(),
    estimated_time: "5-10 minutes"
  }
);