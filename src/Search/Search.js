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

function setInputValueByName(wrapperName, name, value) {
    document.querySelector(wrapperName + " input[name=" + name + "]").value = value;
}

function AdvancedOptions(props) {
    const {addSnackbar} = useNotificationProvider();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        let filter = {};
        let searchObject;
        
        if (searchParams.get("searchObject") !== null) {
            searchObject = JSON.parse(searchParams.get("searchObject"));
            searchObject.tags = JSON.parse(searchObject.tags);
            filter = searchObject;
        }
        filter.tags?.forEach( (tag) => {
            document.querySelector(`.AdvancedOptions .PillCeckbox input[name=${tag}]`).checked = true;
        });
        setInputValueByName(".AdvancedOptions", "name", filter.name || "");
        setInputValueByName(".AdvancedOptions", "location", filter.location || "");
        setInputValueByName(".AdvancedOptions", "author", filter.author || "");
    }, []);

    /** create a filter object on submit and send this via the URL to the searchResults page */
    let handleSubmit = (e) => {
        e.preventDefault();
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
        navigate('/searchResults?searchObject=' + JSON.stringify(searchObject));
    };
    
    return (
        <div className="AdvancedOptions">
            <form className="form-dialog" onSubmit={handleSubmit} action="searchResult">
                <div className="flex">
                    <input type="text" name="name" placeholder="Name"/>
                    <input type="text" name="location" placeholder="Location"/>
                    <input type="text" name="author" placeholder="Author"/>
                    <Tags/>
                    <button type="submit" className="button-submit">Search</button>
                </div>
            </form>
        </div>
    );
}

export default function Search(props) {
    let [advanced, setAdvanced] = useState(false);
    let [searchParams] = useSearchParams();
    let navigate = useNavigate();
    let handleChange = (e) => {

    };

    useEffect(() => {
        let filter = {};
        let keyword;
        if ((keyword = searchParams.get("keyword")) !== null)
            filter = {keyword: keyword};
        setInputValueByName(".Search", "keyword", filter.keyword || "");
    }, []);

    /** sets the keyword GET parameter and navigates to sthe searchResults page */
    let handleSubmit = (e) => {
        e.preventDefault();
        let keyword = e.target.querySelector("input[name=keyword]").value;
        navigate("/searchResults?keyword=" + keyword);
    };

    return (
        <div className="Search input-with-send">
            <form onSubmit={handleSubmit} label="">
                <label for="main-search" style={{display: "none"}}>Main search</label>
                <input id="main-search" type="text" name="keyword" placeholder="author, name, location,..." className="main-search" onKeyPress={handleChange} onChange={handleChange}/>
                <button type="button" onClick={e => setAdvanced(!advanced)}>
                    {advanced ? <AiFillCaretUp /> : <AiFillCaretDown />}
                    <span style={{display: "none"}}>Extend/hide advanced options</span>
                </button>
            </form>
            {advanced && <AdvancedOptions/>}
        </div>
    );
}