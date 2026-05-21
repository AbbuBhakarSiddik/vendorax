import { useEffect, useState, useCallback } from 'react'
import { getAllUsers, deleteUser } from '../../../api/admin'
import useAuthStore from '../../../store/useAuthStore'

const ManageUsers = () => {
    const currentUser = useAuthStore(s => s.user)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [roleFilter, setRoleFilter] = useState('')
    const [search, setSearch] = useState('')

    const fetchUsers = useCallback(async () => { try { const res = await getAllUsers({ role: roleFilter || undefined }); setUsers(res.data.users) } catch { setUsers([]) } finally { setLoading(false) } }, [roleFilter])
    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleDelete = async (id) => { if (!window.confirm('Delete this user? This cannot be undone.')) return; setDeleting(id); try { await deleteUser(id); fetchUsers() } catch (err) { alert(err.response?.data?.message || 'Failed to delete user') } finally { setDeleting(null) } }

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div><h1 className="text-2xl font-bold text-gray-800">Manage Users</h1><p className="text-gray-400 text-sm">{users.length} users on platform</p></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 w-48 bg-white transition-all" />
                        </div>
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-white transition-all appearance-none cursor-pointer">
                            <option value="">All roles</option><option value="seller">Sellers</option><option value="buyer">Buyers</option><option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">{[1,2,3].map(i => (<div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"><div className="h-4 bg-gray-100 rounded-lg w-1/3 mb-2" /><div className="h-3 bg-gray-100 rounded-lg w-1/2" /></div>))}</div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center"><span className="text-3xl">👥</span></div><p className="text-gray-500 font-medium text-sm">No users found</p></div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl shadow-purple-500/[0.03] animate-fade-in-up animation-delay-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">User</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Email</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Role</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Joined</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(user => (
                                        <tr key={user._id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{user.name?.[0]?.toUpperCase()}</div>
                                                    <span className="text-sm font-semibold text-gray-800">{user.name}{user._id === currentUser?.id && <span className="ml-1.5 text-xs text-purple-500 font-medium">(you)</span>}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${user.role === 'seller' ? 'bg-purple-50 text-purple-700' : user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-5 py-3.5">
                                                {user.role !== 'admin' && user._id !== currentUser?.id && (
                                                    <button onClick={() => handleDelete(user._id)} disabled={deleting === user._id} className="text-xs text-red-400 hover:text-red-600 font-semibold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50">
                                                        {deleting === user._id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageUsers