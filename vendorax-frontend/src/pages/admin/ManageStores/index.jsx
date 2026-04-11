import { useEffect, useState } from 'react'
import { getAllStores, toggleStoreStatus, toggleFeaturedStore } from '../../../api/admin'

const ManageStores = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [search, setSearch] = useState('')

    const fetchStores = async () => {
        try {
            const res = await getAllStores()
            setStores(res.data.stores)
        } catch {
            setStores([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStores() }, [])

    const handleToggleStatus = async (id) => {
        setUpdating(id + 'status')
        try {
            await toggleStoreStatus(id)
            fetchStores()
        } finally {
            setUpdating(null)
        }
    }

    const handleToggleFeatured = async (id) => {
        setUpdating(id + 'featured')
        try {
            await toggleFeaturedStore(id)
            fetchStores()
        } finally {
            setUpdating(null)
        }
    }

    const filtered = stores.filter(s =>
        s.storeName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manage stores</h1>
                        <p className="text-gray-500 text-sm mt-1">{stores.length} stores on platform</p>
                    </div>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search stores..."
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-56"
                    />
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
                        <p className="text-gray-400 text-sm">No stores found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(store => (
                            <div key={store._id}
                                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-800 text-sm">
                                            {store.storeName}
                                        </h3>
                                        {!store.isActive && (
                                            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                                                Suspended
                                            </span>
                                        )}
                                        {store.isFeatured && (
                                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        vendorax.app/store/{store.storeSlug}
                                    </p>
                                    {store.sellerId && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Owner: {store.sellerId.name} · {store.sellerId.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4 shrink-0">
                                    <button
                                        onClick={() => handleToggleFeatured(store._id)}
                                        disabled={updating === store._id + 'featured'}
                                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${store.isFeatured
                                                ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}>
                                        {updating === store._id + 'featured'
                                            ? '...'
                                            : store.isFeatured ? 'Unfeature' : 'Feature'
                                        }
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(store._id)}
                                        disabled={updating === store._id + 'status'}
                                        className={`text-xs px-3 py-1.5 rounded-lg transition ${store.isActive
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                                            }`}>
                                        {updating === store._id + 'status'
                                            ? '...'
                                            : store.isActive ? 'Suspend' : 'Activate'
                                        }
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