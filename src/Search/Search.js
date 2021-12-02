import {useState, useEffect} from 'react';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {Tags} from '../NewExperience/NewExperience';
import useNotificationProvider from '../NotificationProvider/useNotificationProvider';

import '../common.css';
import './Search.css';
import { snackbarClasses } from '@mui/material';

function AdvancedOptions(props) {
    const {snackbar, addSnackbar} = useNotificationProvider();
    useEffect(() => {
    });

    let handleSubmit = (e) => {
        e.preventDefault();
        addSnackbar("success", "Searching!");
    };
    
    return (
        <div className="AdvancedOptions">
            <form className="form-dialog" onSubmit={handleSubmit}>
                <div className="flex">
                    <input type="text" name="name" placeholder="Name"/>
                    <input type="text" name="location" placeholder="Location"/>
                    <input type="text" name="author" placeholder="Author"/>
                    <Tags />
                    <button type="submit" className="button-submit">Search</button>
                </div>
            </form>
        </div>
    );
}

export default function Search(props) {
    let [advanced, setAdvanced] = useState(false);
    let handleChange = (e) => {

    };

    let handleSubmit = (e) => {
        e.preventDefault();
    };

    /*let advOptions = "";
    if (advanced) {
        advOptions = <AdvancedOptions />;
    }*/

    return (
        <div className="Search input-with-send">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="author, name, location,..." className="main-search" onKeyPress={handleChange} onChange={handleChange}/>
                <button type="button" onClick={e => setAdvanced(!advanced)}>
                    {advanced ? <AiFillCaretUp /> : <AiFillCaretDown />}
                </button>
            </form>
            {advanced && <AdvancedOptions/>}
        </div>
    );
}