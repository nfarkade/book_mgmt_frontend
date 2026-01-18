import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../auth/ProtectedRoute';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when token exists', () => {
    localStorageMock.getItem.mockReturnValue('valid-token');
    
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when token does not exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('checks token from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('token');
    
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  });
});
