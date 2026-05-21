import { useEffect, useState } from 'react'
import { getAllStores, toggleStoreStatus, toggleFeaturedStore } from '../../../api/admin'

const ManageStores = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [search, setSearch] = useState('')

    const fetchStores = async () => { try { const res = await getAllStores(); setStores(res.data.stores) } catch { setStores([]) } finally { setLoading(false) } }
    useEffect(() => { fetchStores() }, [])

    const handleToggleStatus = async (id) => { setUpdating(id + 'status'); try { await toggleStoreStatus(id); fetchStores() } finally { setUpdating(null) } }
    const handleToggleFeatured = async (id) => { setUpdating(id + 'featured'); try { await toggleFeaturedStore(id); fetchStores() } finally { setUpdating(null) } }

    const filtered = stores.filter(s => s.storeName.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div><h1 className="text-2xl font-bold text-gray-800">Manage Stores</h1><p className="text-gray-400 text-sm">{stores.length} stores on platform</p></div>
                    </div>
                    <div className="relative">
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..." className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 w-56 bg-white transition-all" />
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">{[1,2,3].map(i => (<div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"><div className="h-4 bg-gray-100 rounded-lg w-1/3 mb-2" /><div className="h-3 bg-gray-100 rounded-lg w-1/2" /></div>))}</div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center"><span className="text-3xl">🏪</span></div><p className="text-gray-500 font-medium text-sm">No stores found</p></div>
                ) : (
                    <div className="space-y-3 animate-fade-in-up animation-delay-100">
                        {filtered.map((store, i) => (
                            <div key={store._id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover stagger-child" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center shrink-0">
                                        <span className="text-purple-600 font-bold">{store.storeName[0]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-gray-800 text-sm">{store.storeName}</h3>
                                            {!store.isActive && (<span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">Suspended</span>)}
                                            {store.isFeatured && (<span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">⭐ Featured</span>)}
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>vendorax.app/store/{store.storeSlug}</p>
                                        {store.sellerId && (<p className="text-xs text-gray-500 mt-1">Owner: <span className="font-medium">{store.sellerId.name}</span> · {store.sellerId.email}</p>)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => handleToggleFeatured(store._id)} disabled={updating === store._id + 'featured'}
                                        className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all duration-200 ${store.isFeatured ? 'border-amber-200 text-amber-700 hover:bg-amber-50 bg-amber-50/50' : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}>
                                        {updating === store._id + 'featured' ? '...' : store.isFeatured ? '⭐ Unfeature' : '☆ Feature'}
                                    </button>
                                    <button onClick={() => handleToggleStatus(store._id)} disabled={updating === store._id + 'status'}
                                        className={`text-xs px-3.5 py-2 rounded-xl transition-all duration-200 font-semibold ${store.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`}>
                                        {updating === store._id + 'status' ? '...' : store.isActive ? 'Suspend' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageStores