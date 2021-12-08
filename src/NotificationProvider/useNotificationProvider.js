import { useContext } from 'react';
import { NotificationProviderContext } from './NotificationProvider';

function useNotificationProvider() {
  const { snackbar, addSnackbar, removeSnackbar, confirmation, askForConfirmation, removeConfirmation } = useContext(NotificationProviderContext);
  return { snackbar, addSnackbar, removeSnackbar, confirmation, askForConfirmation, removeConfirmation };
}

export function withNotificationProvider(Component) {
  return function WrappedComponent(props) {
    const { snackbar, addSnackbar, removeSnackbar, confirmation, askForConfirmation, removeConfirmation } = useNotificationProvider();
    return <Component {...props} snackbar={snackbar} addSnackbar={addSnackbar} askForConfirmation={askForConfirmation} />;
  }
}

export default useNotificationProvider;