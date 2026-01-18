import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/Navbar';
import * as authAPI from '../../api/auth';

jest.mock('../../api/auth');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  test('renders navbar with all navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/book manager/i)).toBeInTheDocument();
    expect(screen.getByText(/books/i)).toBeInTheDocument();
    expect(screen.getByText(/add book/i)).toBeInTheDocument();
    expect(screen.getByText(/authors management/i)).toBeInTheDocument();
    expect(screen.getByText(/documents/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('calls logout function on logout button click', async () => {
    const user = userEvent.setup();
    authAPI.logout.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    await user.click(logoutButton);

    expect(authAPI.logout).toHaveBeenCalled();
  });

  test('redirects to login after logout', async () => {
    const user = userEvent.setup();
    authAPI.logout.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    await user.click(logoutButton);

    expect(window.location.href).toBe('/login');
  });
});
