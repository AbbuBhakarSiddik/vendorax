import { useEffect } from 'react'
import { io } from 'socket.io-client'
import useAuthStore from '../store/useAuthStore'
import useNotificationStore from '../store/useNotificationStore'

let socket = null

export const getSocket = () => socket

const useSocket = () => {
    const user = useAuthStore(s => s.user)
    const addNotification = useNotificationStore(s => s.addNotification)

    useEffect(() => {
        // If no user is logged in, clean up the socket
        if (!user) {
            if (socket) {
                socket.disconnect()
                socket = null
            }
            return
        }

        // Initialize the socket singleton if it doesn't exist
        if (!socket) {
            socket = io('http://localhost:5000', {
                transports: ['websocket'],
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                autoConnect: true
            })
            
            socket.on('connect_error', (err) => {
                console.log('Socket connection error:', err.message)
            })
        }

        // Handler functions
        const handleConnect = () => {
            console.log('Socket connected:', socket.id)
            socket.emit('join', user.id)
            if (user.role === 'seller') {
                socket.emit('joinSeller', user.id)
            }
        }

        const handleNewOrder = (data) => {
            addNotification({
                type: 'success',
                message: data.message,
                orderId: data.order?._id
            })
        }

        const handleOrderUpdate = (data) => {
            addNotification({
                type: 'info',
                message: data.message,
                orderId: data.orderId
            })
        }

        const handleOrderCancelled = (data) => {
            addNotification({
                type: 'warning',
                message: data.message,
                orderId: data.orderId
            })
        }

        // Attach listeners
        socket.on('connect', handleConnect)
        socket.on('newOrder', handleNewOrder)
        socket.on('orderUpdate', handleOrderUpdate)
        socket.on('orderCancelled', handleOrderCancelled)

        // If the socket is already connected, it won't fire the 'connect' event again, 
        // so we manually call the connect handler to ensure rooms are joined.
        if (socket.connected) {
            handleConnect()
        }

        // Cleanup: remove listeners for this specific component instance
        return () => {
            if (socket) {
                socket.off('connect', handleConnect)
                socket.off('newOrder', handleNewOrder)
                socket.off('orderUpdate', handleOrderUpdate)
                socket.off('orderCancelled', handleOrderCancelled)
            }
            // Note: We do NOT disconnect the global socket here.
            // It will be disconnected only when the user logs out (!user).
        }
    }, [user, addNotification])

    return socket
}

export default useSocket