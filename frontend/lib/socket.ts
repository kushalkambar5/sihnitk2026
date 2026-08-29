import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to DocPrint WebSockets:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSockets');
    });
  }
  return socket;
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  s.emit('join:user', userId);
};

export const joinShopRoom = (shopId: string) => {
  const s = getSocket();
  s.emit('join:shop', shopId);
};

export const joinDeliveryRoom = (deliveryId: string) => {
  const s = getSocket();
  s.emit('join:delivery', deliveryId);
};
