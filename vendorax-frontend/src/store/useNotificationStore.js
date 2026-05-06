import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
    notifications: [],

    addNotification: (notif) => {
        const newNotif = {
            id: Date.now(),
            ...notif,
            read: false,
            time: new Date()
        }
        set(state => ({
            notifications: [newNotif, ...state.notifications].slice(0, 20)
        }))
    },

    markAllRead: () => {
        set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true }))
        }))
    },

    clearAll: () => set({ notifications: [] }),

    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length
    }
}))

export default useNotificationStore