import React, { useState, useCallback } from 'react';

export const NotificationProviderContext = React.createContext({
  snackbar: null,
  addSnackbar: () => {},
  removeSnackbar: () => {}
});

export default function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);

  const removeSnackbar = () => setSnackbar(null);

  const addSnackbar = (message, severity) => {setSnackbar({ message, severity }); console.log("addSnackbar triggered.")};

  const contextValue = {
    snackbar,
    addSnackbar: useCallback((message, severity) => addSnackbar(message, severity), []),
    removeSnackbar: useCallback(() => removeSnackbar(), [])
  };

  return (
    <NotificationProviderContext.Provider value={contextValue}>
      {children}
    </NotificationProviderContext.Provider>
  );
}