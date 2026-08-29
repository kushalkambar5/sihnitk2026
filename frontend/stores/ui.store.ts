import { create } from 'zustand';

interface UiState {
  isUploadModalOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isSidebarOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  toggleNotificationDrawer: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isUploadModalOpen: false,
  isNotificationDrawerOpen: false,
  isSidebarOpen: true,

  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  toggleNotificationDrawer: () => set((state) => ({ isNotificationDrawerOpen: !state.isNotificationDrawerOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
}));
