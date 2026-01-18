import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Signup from '../../auth/Signup';
import * as authAPI from '../../api/auth';
import * as errorHandler from '../../utils/errorHandler';

jest.mock('../../api/auth');
jest.mock('../../utils/errorHandler');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  test('displays link to login page', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('updates form fields on input', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    errorHandler.handleApiError.mockReturnValue('Test error');

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Trigger an error first
    authAPI.signup.mockRejectedValue(new Error('Test error'));
    const submitButton = screen.getByRole('button', { name: /signup/i });
    
    await user.type(screen.getByPlaceholderText(/username/i), 'test');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(screen.getByPlaceholderText(/username/i), 'new');
    
    await waitFor(() => {
      expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
    });
  });

  test('shows error when username is missing', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
    });
  });

  test('shows error when password is missing', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
    });
  });

  test('shows error when password is too short', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), '12345');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('calls signup API on form submit', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    authAPI.signup.mockResolvedValue({ data: { message: 'User created' } });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(authAPI.signup).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        email: '',
      });
    });
  });

  test('navigates to login on successful signup', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    authAPI.signup.mockResolvedValue({ data: { message: 'User created' } });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays error message on signup failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Username already exists';
    errorHandler.handleApiError.mockReturnValue(errorMessage);
    authAPI.signup.mockRejectedValue(new Error('Conflict'));

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'existinguser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('shows loading state during signup', async () => {
    const user = userEvent.setup();
    authAPI.signup.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    });
  });

  test('disables form fields during loading', async () => {
    const user = userEvent.setup();
    authAPI.signup.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeDisabled();
      expect(screen.getByPlaceholderText(/password/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
    });
  });

  test('handles email input (optional field)', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    authAPI.signup.mockResolvedValue({ data: { message: 'User created' } });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(authAPI.signup).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('prevents form submission when password is too short', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), '12345');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(authAPI.signup).not.toHaveBeenCalled();
    });
  });

  test('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    errorHandler.handleApiError.mockReturnValue('Network error. Please check your connection.');
    authAPI.signup.mockRejectedValue({ message: 'Network Error' });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
