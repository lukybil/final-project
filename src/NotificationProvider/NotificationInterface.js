import useNotificationProvider from './useNotificationProvider';
import MySnackbar from '../MySnackbar';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

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

export function ConfirmationInterface() {
  const {confirmation, removeConfirmation} = useNotificationProvider();

  const handleClose = () => {
    removeConfirmation();
  }

  return (
      <Dialog
        open={confirmation?.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirmation-dialog"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmation?.question}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you would like to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <button onClick={handleClose} className="button-danger">Cancel</button>
            <button className="button-confirm" onClick={(e) => {handleClose(); confirmation.onConfirm()}}>Confirm</button>
        </DialogActions>
      </Dialog>
  );
}