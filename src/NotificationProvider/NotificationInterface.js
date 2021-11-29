import useNotificationProvider from './useNotificationProvider';
import MySnackbar from '../MySnackbar';

export default function NotificationInterface() {
  const { snackbar, removeSnackbar } = useNotificationProvider();

  const handleClose = () => {
    removeSnackbar(snackbar.severity, snackbar.message);
  };

  return (
    <MySnackbar 
        open={snackbar?.open} 
        message={snackbar?.message} 
        severity={snackbar?.severity} 
        onClose={handleClose}
    />
  )
}