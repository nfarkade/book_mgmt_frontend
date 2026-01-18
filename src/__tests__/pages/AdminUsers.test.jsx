import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminUsers from '../../pages/AdminUsers';
import * as usersAPI from '../../api/users';
import * as authAPI from '../../api/auth';

jest.mock('../../api/users');
jest.mock('../../api/auth');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify(['admin'])),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('AdminUsers Component', () => {
  const mockUsers = [
    { id: 1, username: 'user1', email: 'user1@test.com', roles: [{ name: 'user' }] },
    { id: 2, username: 'user2', email: 'user2@test.com', roles: [{ name: 'admin' }] },
  ];

  const mockRoles = [
    { id: 1, name: 'admin', can_read: true, can_write: true, can_delete: true, is_admin: true },
    { id: 2, name: 'user', can_read: true, can_write: false, can_delete: false, is_admin: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    usersAPI.getUsers.mockResolvedValue({ data: mockUsers });
    usersAPI.getRoles.mockResolvedValue({ data: mockRoles });
    authAPI.isAdmin.mockReturnValue(true);
    window.confirm = jest.fn(() => true);
  });

  test('renders admin users page', async () => {
    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/user & role management/i)).toBeInTheDocument();
    });
  });

  test('loads users and roles on mount', async () => {
    render(<AdminUsers />);

    await waitFor(() => {
      expect(usersAPI.getUsers).toHaveBeenCalled();
      expect(usersAPI.getRoles).toHaveBeenCalled();
    });
  });

  test('switches between users and roles tabs', async () => {
    const user = userEvent.setup();
    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument();
    });

    const rolesTab = screen.getByText(/roles/i);
    await user.click(rolesTab);

    await waitFor(() => {
      expect(screen.getByText(/add role/i)).toBeInTheDocument();
    });
  });

  test('shows add user form when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/add user/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add user/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    });
  });

  test('creates new user', async () => {
    const user = userEvent.setup();
    usersAPI.createUser.mockResolvedValue({ data: { id: 3, username: 'newuser' } });

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/add user/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add user/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/username/i), 'newuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.selectOptions(screen.getByLabelText(/role/i), 'user');
    await user.click(screen.getByText(/create user/i));

    await waitFor(() => {
      expect(usersAPI.createUser).toHaveBeenCalled();
    });
  });

  test('deletes user after confirmation', async () => {
    const user = userEvent.setup();
    usersAPI.deleteUser.mockResolvedValue({});

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(usersAPI.deleteUser).toHaveBeenCalled();
    });
  });

  test('shows add role form when add role button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/roles/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/roles/i));
    await waitFor(() => {
      expect(screen.getByText(/add role/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add role/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/role name/i)).toBeInTheDocument();
    });
  });

  test('creates new role', async () => {
    const user = userEvent.setup();
    usersAPI.createRole.mockResolvedValue({ data: { id: 3, name: 'editor' } });

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText(/roles/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/roles/i));
    await waitFor(() => {
      expect(screen.getByText(/add role/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/add role/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/role name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/role name/i), 'editor');
    await user.click(screen.getByText(/create role/i));

    await waitFor(() => {
      expect(usersAPI.createRole).toHaveBeenCalled();
    });
  });
});
