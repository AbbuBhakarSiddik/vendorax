import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser } from '../../../api/admin'
import useAuthStore from '../../../store/useAuthStore'

const ManageUsers = () => {
    const currentUser = useAuthStore(s => s.user)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [roleFilter, setRoleFilter] = useState('')
    const [search, setSearch] = useState('')

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers({ role: roleFilter || undefined })
            setUsers(res.data.users)
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [roleFilter])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return
        setDeleting(id)
        try {
            await deleteUser(id)
            fetchUsers()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user')
        } finally {
            setDeleting(null)
        }
    }

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manage users</h1>
                        <p className="text-gray-500 text-sm mt-1">{users.length} users on platform</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-48"
                        />
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">All roles</option>
                            <option value="seller">Sellers</option>
                            <option value="buyer">Buyers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                        <p className="text-gray-400 text-sm">No users found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">User</th>
                                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Email</th>
                                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Role</th>
                                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Joined</th>
                                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 text-sm font-medium text-gray-800">
                                            {user.name}
                                            {user._id === currentUser?.id && (
                                                <span className="ml-2 text-xs text-purple-600">(you)</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'seller'
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : user.role === 'admin'
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-5 py-3">
                                            {user.role !== 'admin' && user._id !== currentUser?.id && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={deleting === user._id}
                                                    className="text-xs text-red-500 hover:underline disabled:opacity-50">
                                                    {deleting === user._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageUsers