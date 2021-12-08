import useNotificationProvider from './NotificationProvider/useNotificationProvider';

export function withHooks(Component) {
  return function WrappedComponent(props) {
    const { snackbar, addSnackbar, removeSnackbar, confirmation, askForConfirmation, removeConfirmation } = useNotificationProvider();
    return <Component {...props} snackbar={snackbar} addSnackbar={addSnackbar} askForConfirmation={askForConfirmation} />;
  }
}

export default withHooks;