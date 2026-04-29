import { create } from 'zustand'

const useStore = create((set) => ({
  // Sidebar open/close (untuk mobile)
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Active page title (untuk topbar)
  pageTitle: 'Dashboard Utama',
  setPageTitle: (title) => set({ pageTitle: title }),

  // Wedding profile cache
  weddingProfile: null,
  setWeddingProfile: (profile) => set({ weddingProfile: profile }),
}))

export default useStore
