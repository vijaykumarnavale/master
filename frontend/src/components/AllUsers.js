import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import './AllUsers.css'; // Import the CSS file

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Error fetching users'); // Display error toast
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully'); // Show success message on delete
    } catch (error) {
      toast.error('Error deleting user'); // Display error toast on failure
      console.error('Error deleting user:', error);
    }
  };

  // Handle Edit (Save Changes)
  const handleEdit = async (user) => {
    try {
      await axios.put(`http://localhost:5000/users/${user.id}`, user);
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingUser(null);
      toast.success('User updated successfully'); // Display success toast on save
    } catch (error) {
      toast.error('Error updating user'); // Display error toast on failure
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
            <input
              type="text"
              value={editingUser.full_name}
              onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
            />
          </td>
          <td>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
          </td>
          <td>
            <button className="btn btn-save" onClick={() => handleEdit(editingUser)}>Save</button>
            <button className="btn btn-cancel" onClick={() => setEditingUser(null)}>Cancel</button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.full_name}</td>
        <td>{user.email}</td>
        <td>
          <button className="btn btn-edit" onClick={() => setEditingUser(user)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h1>All Users</h1>
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{users.map((user) => renderRow(user))}</tbody>
      </table>

      {/* ToastContainer to display the toast messages */}
      <ToastContainer />
    </div>
  );
};

export default AllUsers;
