import {useState, useEffect} from 'react';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {Tags} from '../NewExperience/NewExperience';
import useNotificationProvider from '../NotificationProvider/useNotificationProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';

import '../common.css';
import './Search.css';
import { snackbarClasses } from '@mui/material';

function getInputValueByName(wrapperName, name) {
    return document.querySelector(wrapperName + " input[name=" + name + "]").value;
}

function AdvancedOptions(props) {
    const {addSnackbar} = useNotificationProvider();
    /*const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useState();*/
    const navigate = useNavigate();
    useEffect(() => {
    });

    let handleSubmit = (e) => {
        e.preventDefault();
        //addSnackbar("success", "Searching!");
        let wrapperName = ".AdvancedOptions";
        let searchObject = {};
        searchObject.name = getInputValueByName(wrapperName, "name");
        searchObject.location = getInputValueByName(wrapperName, "location");
        searchObject.author = getInputValueByName(wrapperName, "author");
        searchObject.tags = "";
        let tags = []
		document.querySelectorAll(".AdvancedOptions .PillCheckbox input:checked").forEach( (input) => {
			tags.push(input.value);
		});
        searchObject.tags = JSON.stringify(tags);
        //let params = serializeFormQuery(event.target);
        navigate('/searchResults?searchObject=' + JSON.stringify(searchObject));
    };
    
    return (
        <div className="AdvancedOptions">
            <form className="form-dialog" onSubmit={handleSubmit} action="searchResult">
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
    let navigate = useNavigate();
    let handleChange = (e) => {

    };

    let handleSubmit = (e) => {
        e.preventDefault();
        let keyword = e.target.querySelector("input[name=keyword]").value;
        navigate("/searchResults?keyword=" + keyword);
    };

    /*let advOptions = "";
    if (advanced) {
        advOptions = <AdvancedOptions />;
    }*/

    return (
        <div className="Search input-with-send">
            <form onSubmit={handleSubmit}>
                <input type="text" name="keyword" placeholder="author, name, location,..." className="main-search" onKeyPress={handleChange} onChange={handleChange}/>
                <button type="button" onClick={e => setAdvanced(!advanced)}>
                    {advanced ? <AiFillCaretUp /> : <AiFillCaretDown />}
                </button>
            </form>
            {advanced && <AdvancedOptions/>}
        </div>
    );
}