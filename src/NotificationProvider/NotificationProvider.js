import React, { useState, useCallback } from 'react';

export const NotificationProviderContext = React.createContext({
  snackbar: null,
  addSnackbar: () => {},
  removeSnackbar: () => {},
  confirmation: null,
  askForConfirmation: () => {},
  removeConfirmation: () => {}
});

export default function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const removeSnackbar = (severity, message) => setSnackbar({ open: false, severity, message });

  const addSnackbar = (severity, message) => setSnackbar({ open: true, severity, message });

  const askForConfirmation = (question, onConfirm) => setConfirmation({open: true, question, onConfirm});

  const removeConfirmation = () => setConfirmation({open: false});

  const contextValue = {
    snackbar,
    addSnackbar: useCallback((severity, message) => addSnackbar(severity, message), []),
    removeSnackbar: useCallback((severity, message) => removeSnackbar(severity, message), []),
    confirmation,
    askForConfirmation: useCallback((question, onConfirm) => askForConfirmation(question, onConfirm), []),
    removeConfirmation: useCallback(() => removeConfirmation(), [])
  };

  return (
    <NotificationProviderContext.Provider value={contextValue}>
      {children}
    </NotificationProviderContext.Provider>
  );
}