import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constants';
import { tokenStorage } from '@/api/client';

/**
 * Optional real-time layer (Socket.IO). Only connects if VITE_SOCKET_URL is set.
 * Usage:
 *   const socket = getSocket();
 *   socket?.on('notification', handler);
 */
let socket = null;

export function getSocket() {
  if (!SOCKET_URL) return null;
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token: tokenStorage.get() },
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
