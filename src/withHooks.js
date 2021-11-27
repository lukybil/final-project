import useNotificationProvider from './NotificationProvider/useNotificationProvider';

export function withHooks(Component) {
  return function WrappedComponent(props) {
    const { snackbar, addSnackbar, removeSnackbar } = useNotificationProvider();
    return <Component {...props} snackbar={snackbar} addSnackbar={addSnackbar} />;
  }
}

export default withHooks;