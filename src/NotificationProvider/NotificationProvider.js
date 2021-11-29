import React, { useState, useCallback } from 'react';

export const NotificationProviderContext = React.createContext({
  snackbar: null,
  addSnackbar: () => {},
  removeSnackbar: () => {}
});

export default function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);

  const removeSnackbar = (severity, message) => setSnackbar({ open: false, severity, message });

  const addSnackbar = (severity, message) => setSnackbar({ open: true, severity, message });

  const contextValue = {
    snackbar,
    addSnackbar: useCallback((severity, message) => addSnackbar(severity, message), []),
    removeSnackbar: useCallback((severity, message) => removeSnackbar(severity, message), [])
  };

  return (
    <NotificationProviderContext.Provider value={contextValue}>
      {children}
    </NotificationProviderContext.Provider>
  );
}