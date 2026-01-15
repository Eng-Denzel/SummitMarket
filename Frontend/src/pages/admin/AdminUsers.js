import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, toggleUserStaff, toggleUserActive } from '../../services/adminApi';
import { toast } from 'react-toastify';
import Loading from '../../components/layout/Loading';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterStaff, filterActive]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStaff !== 'all') params.is_staff = filterStaff;
      if (filterActive !== 'all') params.is_active = filterActive;

      const response = await getUsers(params);
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStaff = async (userId) => {
    try {
      await toggleUserStaff(userId);
      toast.success('User staff status updated');
      fetchUsers();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await toggleUserActive(userId);
      toast.success('User active status updated');
      fetchUsers();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Failed to update active status');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterStaff} onChange={(e) => setFilterStaff(e.target.value)}>
            <option value="all">All Users</option>
            <option value="true">Staff Only</option>
            <option value="false">Non-Staff</option>
          </select>

          <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Staff</th>
              <th>Active</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{`${user.first_name} ${user.last_name}`.trim() || '-'}</td>
                <td>
                  <span className={`badge ${user.is_staff ? 'staff' : 'regular'}`}>
                    {user.is_staff ? 'Staff' : 'Regular'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{user.total_orders}</td>
                <td>${parseFloat(user.total_spent || 0).toFixed(2)}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleStaff(user.id)}
                      title="Toggle Staff Status"
                    >
                      <i className="fas fa-user-shield"></i>
                    </button>
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleActive(user.id)}
                      title="Toggle Active Status"
                    >
                      <i className="fas fa-power-off"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                      title="Delete User"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
