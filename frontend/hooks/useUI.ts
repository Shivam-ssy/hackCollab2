// This hook is deprecated - use state management in individual components instead
// UI state is now handled locally in components like sidebar and top-bar
export function useUI() {
  return {
    sidebarOpen: false,
    darkMode: false,
    notificationCount: 0,
    toggleSidebar: () => {},
    setSidebarOpen: () => {},
    toggleDarkMode: () => {},
    setNotificationCount: () => {},
  };
}
