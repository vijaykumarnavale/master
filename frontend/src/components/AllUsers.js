import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faUser, faEnvelope, faPhone, faTag } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import './AllUsers.css'; // Import custom CSS

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_NODE_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        toast.error('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_NODE_API_URL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  // Handle Edit (Save Changes)
  const handleEdit = async (user) => {
    try {
      await axios.put(`${process.env.REACT_APP_NODE_API_URL}/users/${user.id}`, user);
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  // Render User Row
  const renderRow = (user) => {
    if (editingUser?.id === user.id) {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>
            <FontAwesomeIcon icon={faUser} /> 
            <input
              type="text"
              value={editingUser.full_name}
              onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
            />
          </td>
          <td>
            <FontAwesomeIcon icon={faEnvelope} /> 
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
          </td>
          <td>
            <FontAwesomeIcon icon={faPhone} /> 
            <input
              type="text"
              value={editingUser.contact_number}
              onChange={(e) => setEditingUser({ ...editingUser, contact_number: e.target.value })}
            />
          </td>
          <td>
            <FontAwesomeIcon icon={faTag} /> 
            <input
              type="text"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            />
          </td>
          <td>
            <button className="btn btn-save" onClick={() => handleEdit(editingUser)}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="btn btn-cancel" onClick={() => setEditingUser(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>
          <FontAwesomeIcon icon={faUser} /> {user.full_name}
        </td>
        <td>
          <FontAwesomeIcon icon={faEnvelope} /> {user.email}
        </td>
        <td>
          <FontAwesomeIcon icon={faPhone} /> {user.contact_number}
        </td>
        <td>
          <FontAwesomeIcon icon={faTag} /> {user.role}
        </td>
        <td>
          <button className="btn btn-edit" onClick={() => setEditingUser(user)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h1>All Users</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            ) : (
              users.map((user) => renderRow(user))
            )}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllUsers;
