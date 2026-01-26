import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AdminPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <Link to="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <FaArrowLeft /> Back to Home
        </Link>
        <h1>User Management Dashboard</h1>
        <p className="admin-subtitle">View all registered users</p>
      </div>

      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : error ? (
        <div className="admin-error">Error: {error}</div>
      ) : (
        <div className="admin-content">
          <div className="stats-card">
            <h3>Total Registered Users</h3>
            <div className="stat-number">{users.length}</div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Registered</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No users registered yet
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id.substring(0, 8)}...</td>
                      <td>{user.name || 'N/A'}</td>
                      <td>{user.email}</td>
                      <td>{user.company || 'N/A'}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>{formatDate(user.last_login)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
