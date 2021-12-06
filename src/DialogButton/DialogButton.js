import NewExperience from '../NewExperience/NewExperience';

import Dialog from '@mui/material/Dialog';
import restrictAccess from '../decorators/restrictAccess';
import { useState } from 'react';

import useNotificationProvider from '../NotificationProvider/useNotificationProvider';

export default function DialogButton(props) {
    const [state, setState] = useState({isNewExpOpen: false});
    
    const {addSnackbar} = useNotificationProvider();

    const handlePopupClose = () => { //generic method for closing popups
		setState({isNewExpOpen: false});
	}

    return (
        <div>
            <button
                className="button-primary"
                onClick={(e) => {
                    restrictAccess(props.db, addSnackbar, (e) => setState({isNewExpOpen: true}));
                }}
            >
                {props.text}
            </button>
            <Dialog //dialog object for showing the NewExperience form on add experience button click
					open={state.isNewExpOpen}
					onClose={handlePopupClose.bind(this)}
					scroll={'paper'}
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					maxWidth="lg"
					className="Tile-dialog"
			>
                {props.children}
            </Dialog>
        </div>
    );
}