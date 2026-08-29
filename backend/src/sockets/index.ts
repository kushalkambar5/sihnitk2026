import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSockets = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected to WebSockets: ${socket.id}`);

    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    });

    socket.on('join:shop', (shopId: string) => {
      socket.join(`shop:${shopId}`);
      console.log(`Socket ${socket.id} joined room shop:${shopId}`);
    });

    socket.on('join:delivery', (deliveryId: string) => {
      socket.join(`delivery:${deliveryId}`);
      console.log(`Socket ${socket.id} joined room delivery:${deliveryId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, payload: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

export const emitToShop = (shopId: string, event: string, payload: any) => {
  if (io) {
    io.to(`shop:${shopId}`).emit(event, payload);
  }
};

export const emitToDelivery = (deliveryId: string, event: string, payload: any) => {
  if (io) {
    io.to(`delivery:${deliveryId}`).emit(event, payload);
  }
};
