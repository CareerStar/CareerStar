import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Table, Form, Button, InputGroup,
  Alert, Spinner, Card, Row, Col
} from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatedUsers, setUpdatedUsers] = useState({});
  const [notifications, setNotifications] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [updatedCohorts, setUpdatedCohorts] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const admin_token = localStorage.getItem('admin_token') || '';

  const headers = {
    Authorization: `Bearer ${admin_token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.careerstar.co/users', { headers });
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStarChange = (userId, value) => {
    setUpdatedUsers({
      ...updatedUsers,
      [userId]: parseInt(value, 10) || 0
    });
  };

  const updateStars = async (userId) => {
    if (updatedUsers[userId] === undefined) return;

    try {
      const response = await axios.put(
        `https://api.careerstar.co/users/${userId}/stars`,
        { stars: updatedUsers[userId] },
        { headers }
      );

      setUsers(users.map(user =>
        user.userId === userId
          ? { ...user, stars: updatedUsers[userId] }
          : user
      ));

      setNotifications({
        ...notifications,
        [userId]: { type: 'success', message: 'Stars updated successfully!' }
      });
      setSuccessMessage('Stars updated successfully!');
      setShowSuccess(true);

      setTimeout(() => {
        setNotifications(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      setNotifications({
        ...notifications,
        [userId]: { type: 'danger', message: 'Failed to update stars.' }
      });
      console.error('Error updating stars:', err);
    }
  };

  const updateCohort = async (userId) => {
    if (updatedCohorts[userId] === undefined) return;
    try {
      await axios.put(
        `https://api.careerstar.co/users/${userId}/cohort`,
        { cohort: updatedCohorts[userId] },
        { headers }
      );
      setUsers(users.map(user =>
        user.userId === userId
          ? { ...user, cohort: updatedCohorts[userId] }
          : user
      ));
      setNotifications({
        ...notifications,
        [userId]: { type: 'success', message: 'Cohort updated successfully!' }
      });
      setSuccessMessage('Cohort updated successfully!');
      setShowSuccess(true);
      setTimeout(() => {
        setNotifications(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setNotifications({
        ...notifications,
        [userId]: { type: 'danger', message: 'Failed to update cohort.' }
      });
      console.error('Error updating cohort:', err);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortValue = (user, key) => {
    if (key === 'stars') {
      return updatedUsers[user.userId] !== undefined
        ? updatedUsers[user.userId]
        : user.stars || 0;
    }
    return user[key];
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig, updatedUsers]);

  const filteredUsers = sortedUsers.filter(user => {
    const fullName = `${user.firstname} ${user.lastname || ''}`;
    const email = user.emailID;
    const term = searchTerm.toLowerCase();

    return fullName.toLowerCase().includes(term) || email.toLowerCase().includes(term);
  });

  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('stars')}
                  >
                    Stars {getSortDirectionIndicator('stars')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.emailID}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={updatedUsers[user.userId] !== undefined ? updatedUsers[user.userId] : user.stars || 0}
                          onChange={(e) => handleStarChange(user.userId, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateStars(user.userId)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors ml-2"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={updatedCohorts[user.userId] !== undefined ? updatedCohorts[user.userId] : user.cohort || ''}
                          onChange={e => setUpdatedCohorts({
                            ...updatedCohorts,
                            [user.userId]: e.target.value
                          })}
                          className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateCohort(user.userId)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors ml-2"
                        >
                          Update Cohort
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No users match your search.' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default UserManagement;