import { useContext } from 'react';
import { NotificationProviderContext } from './NotificationProvider';

function useNotificationProvider() {
  const { snackbar, addSnackbar, removeSnackbar } = useContext(NotificationProviderContext);
  return { snackbar, addSnackbar, removeSnackbar };
}

export function withNotificationProvider(Component) {
  return function WrappedComponent(props) {
    const { snackbar, addSnackbar, removeSnackbar } = useNotificationProvider();
    return <Component {...props} snackbar={snackbar} addSnackbar={addSnackbar} />;
  }
}

export default useNotificationProvider;