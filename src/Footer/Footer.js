import "../common.css";
import "./Footer.css";

import {Logo} from '../App';
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export default function Footer(props) {
    let authors = ["Lukas", "Julia", "Aniya", "Archana"];
    let liAuthors = shuffleArray(authors).map( (author) => {
        return <li>{author}</li>
    });
    return (
        <footer>
            <div className="flex">
                <div className="column-logo">
                    <Logo />
                </div>
                <div className="column-authors">
                    <ul className="ul-links">
                        {liAuthors}
                    </ul>
                </div>
                <div className="column-links">
                    <ul className="ul-links">
                        <li><a href="">FAQ</a></li>
                        <li><a href="">Terms {"&"} conditions</a></li>
                    </ul>
                </div>
                <div className="column-icons">
                    <ul className="ul-icons">
                        <li><a href="" className="icon-facebook"><BsFacebook /></a></li>
                        <li><a href="" className="icon-instagram"><BsInstagram /></a></li>
                        <li><a href="" className="icon-twitter"><BsTwitter /></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}