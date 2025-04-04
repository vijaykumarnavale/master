import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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

  const handleEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_NODE_API_URL}/users/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white p-4 shadow-lg rounded-lg">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border p-3">#</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Contact Number</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">No users found</td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className="border hover:bg-gray-100">
                    {editingUser?.id === user.id ? (
                      <>
                        <td className="border p-3">{indexOfFirstUser + index + 1}</td>
                        <td className="border p-3"><input type="text" className="border p-2 rounded w-full" value={editingUser.full_name} onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})} /></td>
                        <td className="border p-3"><input type="email" className="border p-2 rounded w-full" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} /></td>
                        <td className="border p-3"><input type="text" className="border p-2 rounded w-full" value={editingUser.contact_number} onChange={(e) => setEditingUser({...editingUser, contact_number: e.target.value})} /></td>
                        <td className="border p-3"><input type="text" className="border p-2 rounded w-full" value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} /></td>
                        <td className="border p-3 flex space-x-2">
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={handleEdit}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={() => setEditingUser(null)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border p-3">{indexOfFirstUser + index + 1}</td>
                        <td className="border p-3">{user.full_name}</td>
                        <td className="border p-3">{user.email}</td>
                        <td className="border p-3">{user.contact_number}</td>
                        <td className="border p-3">{user.role}</td>
                        <td className="border p-3 flex space-x-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => setEditingUser(user)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(user.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              <FontAwesomeIcon icon={faChevronLeft} /> Prev
            </button>
            <span className="text-gray-700 font-semibold">Page {currentPage}</span>
            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setCurrentPage(prev => (indexOfLastUser < users.length ? prev + 1 : prev))}>
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllUsers;
