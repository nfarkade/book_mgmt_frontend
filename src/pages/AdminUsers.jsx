import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { getUsers, createUser, deleteUser, updateUser, getRoles, createRole, deleteRole, updateRole } from "../api/users";
import { isAdmin } from "../api/auth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role_names: '' });
  const [newRole, setNewRole] = useState({ 
    name: '', 
    can_read: false, 
    can_write: false, 
    can_delete: false, 
    is_admin: false 
  });
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    setUserIsAdmin(isAdmin());
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadUsers(), loadRoles()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.role_names) {
      alert('Username, password, and role are required');
      return;
    }

    const userPayload = {
      username: newUser.username,
      password: newUser.password,
      role_names: [newUser.role_names]
    };
    
    console.log('Attempting to create user with payload:', userPayload);
    console.log('API endpoint: POST /admin/users/');
    
    try {
      const response = await createUser(userPayload);
      console.log('User creation response:', response);
      setNewUser({ username: '', password: '', role_names: '' });
      setShowAddUserForm(false);
      await loadUsers();
      alert('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'Failed to create user';
      
      if (error.response?.data?.detail) {
        if (error.response.data.detail.includes('greenlet_spawn') || 
            error.response.data.detail.includes('sqlalche')) {
          errorMessage = 'Database connection error. Please try again or contact administrator.';
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Role name is required');
      return;
    }

    try {
      await createRole(newRole);
      setNewRole({ 
        name: '', 
        can_read: false, 
        can_write: false, 
        can_delete: false, 
        is_admin: false 
      });
      setShowAddRoleForm(false);
      await loadRoles();
      alert('Role created successfully');
    } catch (error) {
      console.error('Failed to create role:', error);
      alert(`Failed to create role: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        await loadUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
        await loadRoles();
        alert('Role deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete role');
      }
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      can_read: role.can_read,
      can_write: role.can_write,
      can_delete: role.can_delete,
      is_admin: role.is_admin
    });
    setShowAddRoleForm(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Role name is required');
      return;
    }

    try {
      await updateRole(editingRole.id, newRole);
      setEditingRole(null);
      setNewRole({ 
        name: '', 
        can_read: false, 
        can_write: false, 
        can_delete: false, 
        is_admin: false 
      });
      setShowAddRoleForm(false);
      await loadRoles();
      alert('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role:', error);
      alert(`Failed to update role: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ username: user.username, email: user.email, role: user.role });
    setShowAddUserForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, newUser);
      setEditingUser(null);
      setNewUser({ username: '', email: '', role: '' });
      setShowAddUserForm(false);
      await loadUsers();
      alert('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const userColumns = [
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => {
        if (row.roles && Array.isArray(row.roles)) {
          return row.roles.map(role => role.name || role).join(', ');
        }
        return row.role || 'No Role';
      },
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status || 'Active',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${(row.status || 'active').toLowerCase()}`}>
          {row.status || 'Active'}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => handleEditUser(row)}
            disabled={!userIsAdmin}
            style={{opacity: userIsAdmin ? 1 : 0.5, cursor: userIsAdmin ? 'pointer' : 'not-allowed'}}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteUser(row.id)}
            disabled={!userIsAdmin}
            style={{opacity: userIsAdmin ? 1 : 0.5, cursor: userIsAdmin ? 'pointer' : 'not-allowed'}}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const roleColumns = [
    {
      name: 'Role Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Can Read',
      selector: row => row.can_read ? 'Yes' : 'No',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${row.can_read ? 'active' : 'inactive'}`}>
          {row.can_read ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      name: 'Can Write',
      selector: row => row.can_write ? 'Yes' : 'No',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${row.can_write ? 'active' : 'inactive'}`}>
          {row.can_write ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      name: 'Can Delete',
      selector: row => row.can_delete ? 'Yes' : 'No',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${row.can_delete ? 'active' : 'inactive'}`}>
          {row.can_delete ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      name: 'Is Admin',
      selector: row => row.is_admin ? 'Yes' : 'No',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${row.is_admin ? 'active' : 'inactive'}`}>
          {row.is_admin ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => handleEditRole(row)}
            disabled={!userIsAdmin}
            style={{opacity: userIsAdmin ? 1 : 0.5, cursor: userIsAdmin ? 'pointer' : 'not-allowed'}}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteRole(row.id)}
            disabled={!userIsAdmin}
            style={{opacity: userIsAdmin ? 1 : 0.5, cursor: userIsAdmin ? 'pointer' : 'not-allowed'}}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h2>User & Role Management</h2>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </div>

        {activeTab === 'users' && (
          <>
            <div className="page-header">
              <h3>Users</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({ username: '', password: '', role_names: '' });
                  setShowAddUserForm(!showAddUserForm);
                }}
              >
                {showAddUserForm ? 'Cancel' : 'Add User'}
              </button>
            </div>

            {showAddUserForm && (
              <div className="upload-section">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      className="form-control"
                      value={newUser.role_names}
                      onChange={(e) => setNewUser({...newUser, role_names: e.target.value})}
                      required
                    >
                      <option value="">Select a role...</option>
                      {roles.length > 0 ? (
                        roles.map(role => (
                          <option key={role.id} value={role.name}>{role.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="admin">admin</option>
                          <option value="user">user</option>
                        </>
                      )}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </form>
              </div>
            )}

            <DataTable
              columns={userColumns}
              data={users}
              pagination
              paginationPerPage={10}
              progressPending={loading}
              highlightOnHover
              striped
              responsive
              noDataComponent="No users found"
            />
          </>
        )}

        {activeTab === 'roles' && (
          <>
            <div className="page-header">
              <h3>Roles</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingRole(null);
                  setNewRole({ 
                    name: '', 
                    can_read: false, 
                    can_write: false, 
                    can_delete: false, 
                    is_admin: false 
                  });
                  setShowAddRoleForm(!showAddRoleForm);
                }}
              >
                {showAddRoleForm ? 'Cancel' : 'Add Role'}
              </button>
            </div>

            {showAddRoleForm && (
              <div className="upload-section">
                <h3>{editingRole ? 'Edit Role' : 'Add New Role'}</h3>
                <form onSubmit={editingRole ? handleUpdateRole : handleAddRole}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Role Name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Permissions:</label>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={newRole.can_read}
                          onChange={(e) => setNewRole({...newRole, can_read: e.target.checked})}
                        />
                        Can Read
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={newRole.can_write}
                          onChange={(e) => setNewRole({...newRole, can_write: e.target.checked})}
                        />
                        Can Write
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={newRole.can_delete}
                          onChange={(e) => setNewRole({...newRole, can_delete: e.target.checked})}
                        />
                        Can Delete
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={newRole.is_admin}
                          onChange={(e) => setNewRole({...newRole, is_admin: e.target.checked})}
                        />
                        Is Admin
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </form>
              </div>
            )}

            <DataTable
              columns={roleColumns}
              data={roles}
              pagination
              paginationPerPage={10}
              progressPending={loading}
              highlightOnHover
              striped
              responsive
              noDataComponent="No roles found"
            />
          </>
        )}
      </div>
    </div>
  );
}