import useNotificationProvider from './useNotificationProvider';
import MySnackbar from '../MySnackbar';

export default function NotificationInterface() {
  const { snackbar, removeSnackbar } = useNotificationProvider();

  const handleClose = () => {
    removeSnackbar();
  };

  return (
    <MySnackbar 
        open={!!snackbar} 
        message={snackbar?.message} 
        severity={snackbar?.severity} 
        onClose={handleClose}
    />
  )
}