'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { getSocket, joinUserRoom, joinShopRoom } from '@/lib/socket';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user?.id) {
      joinUserRoom(user.id);
      if (user.role === 'SHOP_OWNER' || user.role === 'SHOP_STAFF') {
        // If user has shop info, room will be joined in shop components
      }
    }

    const socket = getSocket();

    const handleOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleQueueUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    };

    const handlePrinterUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] });
    };

    const handleNotificationNew = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('order:updated', handleOrderUpdated);
    socket.on('queue:updated', handleQueueUpdated);
    socket.on('printer:updated', handlePrinterUpdated);
    socket.on('printer:failure', handlePrinterUpdated);
    socket.on('notification:new', handleNotificationNew);

    return () => {
      socket.off('order:updated', handleOrderUpdated);
      socket.off('queue:updated', handleQueueUpdated);
      socket.off('printer:updated', handlePrinterUpdated);
      socket.off('printer:failure', handlePrinterUpdated);
      socket.off('notification:new', handleNotificationNew);
    };
  }, [user, queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
