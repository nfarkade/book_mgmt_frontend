import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page by default', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders navbar when authenticated', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/book manager/i)).toBeInTheDocument();
  });

  test('does not render navbar on login page', () => {
    localStorageMock.getItem.mockReturnValue(null);
    window.history.pushState({}, 'Login', '/login');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.queryByText(/book manager/i)).not.toBeInTheDocument();
  });
});
