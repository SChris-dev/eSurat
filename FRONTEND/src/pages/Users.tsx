import { useEffect, useState } from 'react';
import Api from '../Api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Api.get('/v1/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700 mb-4">User Management</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-teal-100 text-teal-800">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Role</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:underline mr-3">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
