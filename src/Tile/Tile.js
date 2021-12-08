import React from "react";
import '../common.css';
import '../NewExperience/NewExperience.css';
import "./Tile.css";
import {AiFillHeart} from 'react-icons/all'
import Dialog from '@mui/material/Dialog';
import User from "../User/User";
import { BsFillTrashFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import withHooks from "../withHooks";
import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import useNotificationProvider from "../NotificationProvider/useNotificationProvider";

/** class for the basic tile, is used mostly for experiences but also for collections, with two headings and a possible likes amount */
export function Tile(props){
	const [state, setState] = useState({isPopupOpen: false});
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handlePopupClose = () => {
		setState({isPopupOpen: false});
	}

	const generatePopup = () => {
		return (
			<div>
				<img src={props.img} alt={props.h1}></img>
				<h2>{props.h1}</h2>
				<div>{props.likes}</div>
			</div>
		);
	}

	const render = () => {
		let likes;
		if (props.likes !== undefined) {
			likes = (
				<span className="Tile-likes"><AiFillHeart/>{props.likes}</span>
			);
		}
		return (
			<div 
				className="Tile" 
				onClick={props.type === "withPopup" ? 
				((e) => {
					if (!state.isPopupOpen && props.exp.id !== "")
						setState({isPopupOpen: true});
				}) 
				: undefined}
			>
				<img src={props.img} alt={props.h1} className="Tile-img"></img>
				<div className="h-wrapper">
					<span className="Tile-h2">{props.h2}</span>
					<span className="Tile-h1">{props.h1}</span>
				</div>
				{likes}
				<Dialog
					fullScreen={fullScreen}
					open={state.isPopupOpen}
					onClose={handlePopupClose}
					scroll={'paper'}
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					maxWidth={props.maxWidth || "lg"}
					className="Tile-dialog"
				>
					<div>
						<CloseButton handlePopupClose={handlePopupClose} />
						{props.popupElement !== undefined ? props.popupElement : generatePopup()}
					</div>
				</Dialog>
			</div>
		);
	}

	return render();
}

function CloseButton(props) {
	return (
		<button className="CloseButton" onClick={props.handlePopupClose}>x</button>
	);
}

export function CollectionTile(props) {
	const [state, setState] = useState({});
	const {addSnackbar} = useNotificationProvider();
	let collection = {
		id: -1,
		name: "",
		img: "",
		username: "",
		description: "",
		experiences: []
	};
	collection = {...props.collection};

	const generateGrid = () => {
		let expGrid = [];
		expGrid = collection?.experiences?.map( (exp) => {
			return (
				<Grid item xs={12} md={6}>
					<ExpTile exp={checkExpAndFill(exp)} db={props.db} />
				</Grid>
			);
		});
		return expGrid;
	}

	const handleAddExperience = () => {
		const expId = parseInt(document.querySelector("select[name=select-experiences]").value);
		console.log(collection.id);
		props.db.addToCollection(expId, collection.id);
		setState({changeState: true});
		addSnackbar("success", "Experience successfully added to the collection!");
	}

	const generatePopup = () => {
		let selectOptions = props.db.getTopExpByUser(collection.username, -1)
		.filter((exp) => exp.id !== -1)
		.map( (exp) => {
			return <option value={exp.id}>{exp.name}</option>
		});

		let addToColletion = (
			<div className="addExpToCollection-wrapper">
				<select name="select-experiences" className="select-experiences">
					{selectOptions}
				</select>
				<button className="button-primary" onClick={(e) => handleAddExperience()} >Add experience</button>
			</div>
		);

		return (
			<div className="Tile-Dialog-flex CollectionTile">
				<div className="img-wrapper" style={{position: "relative"}}>
					<img className="main-img" src={collection.img} alt={collection.h1}></img>
				</div>
				<div className="wrapper">
					<h2>{collection.name}</h2>
					<User user={props.db.getUser(collection.username)}/>
					{/*deleteButton*/}
					<table>
						<tbody>
							<tr>
								<td>Description: </td>
								<td>{collection.description}</td>
							</tr>
						</tbody>
					</table>
					{collection.username === props.db.getCurrentUser().username && addToColletion}
					<Grid container spacing={2} className="main-Grid-container">
						{collection !== null && generateGrid()}
					</Grid>
				</div>
			</div>
		);
	}
	return (
		<Tile 
			type={(collection.id !== -1 && collection.id !== undefined) && "withPopup"}
			img={collection.img}
			h1={collection.name} 
			h2={collection.username} 
			popupElement={generatePopup()}
			exp={collection}
			maxWidth = "md"
		/>
	);
}

function TagPill(props) {
	return (
		<span className="TagPill">{props.value}</span>
	);
}

/**checks the experience object and fills any missing attributes, used before passing it to the ExpTile or before passing it to the addExp DB function*/
export function checkExpAndFill(exp) {
	if (typeof exp !== 'object' ||
	Array.isArray(exp) ||
	exp === null)
	{	
		exp = {};
	}
	let propNames = ["id", "name", "country", "city", "username", "description", "documentation", "budget", "transportation", "accomodation"];
	propNames.forEach( (prop) => {
		if (exp[prop] === undefined) {
			exp[prop] = "";
		}
	})
	if (exp.likes === undefined || !exp.likes instanceof Set) {
		exp.likes = new Set();
	}
	if (exp.usefulLinks === undefined || !Array.isArray(exp.usefulLinks)) {
		exp.usefulLinks = [];
	}
	if (exp.tags === undefined || !Array.isArray(exp.tags)) {
		exp.tags = [];
	}
	if (exp.comments === undefined || !Array.isArray(exp.comments)) {
		exp.comments = [];
	}
	return exp;
}

//generic input with a send/confirm button, used for comments and search
export function InputWithSend(props) {
	return (
		<span className="input-with-send">
			<input type="text" className="main-search"/>
			<button 
				onClick={ e => {
					let input = e.target.closest(".input-with-send").querySelector("input");
					props.db.postComment(props.exp.id, input.value);
					input.value = "";
					props.setState({});
				}}
			>
				<IoSend />
			</button>
		</span>
	);
}

/** adds a popup dialog to the Tile object, containing all the experience information */
export class ExpTile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isHeartPresent: false};
	}

	generateComment(props) {
		return (
			<div className="Tile-Dialog-Comment">
				<User user={this.props.db.getUser(props.username)}/>
				<span className="date"> {this.props.db.dateToFullFormat(props.date)}</span>
				<p>{props.content}</p>
			</div>
		);
	}

	/** displays a heart, used on doubleClick on the experience image */
	showHeart() {
		this.setState({isHeartPresent: true});
		setTimeout((e) => this.setState({isHeartPresent: false}) , 3000);
	}

	handleImageDoubleClick() {
		if (this.props.db.getCurrentUser().username === "Guest") {
			this.openSignInNeedSnackbar();
		}
		else {
			this.props.db.likeExp(this.props.exp.id);
			this.showHeart();
		}
	}

	openSignInNeedSnackbar() {
		console.log(this);
		this.props.addSnackbar("error", "You have to sign in to perform that action.");
	}

	deleteExp() {
		this.props.db.deleteExp(this.props.exp.id);
		this.props.addSnackbar("success", "Deleted successfully!");
	}

	/** the function for generating the experience popup used for displaying all information about an experience */
	generatePopup() {
		const exp = this.props.exp;
		let usefulLinks = exp.usefulLinks.map( (link) => {
			return <span><a href={link}>{link}</a><br></br></span>
		});
		let comments = [];
		for (let i = exp.comments.length - 1; i >= 0; i--) {
			comments.push(this.generateComment(exp.comments[i]));
		}
		let tags = exp.tags.map( (tag) => {
			return <TagPill value={tag}/>;
		});
		let likeHeart = "";
		if (this.state.isHeartPresent)
			likeHeart = <AiFillHeart className="big-heart"/>
		let attrNames = ["country", "city", "description", "documentation", "budget", "transportation", "accomodation", "usefulLinks", "tags"];
		//infoTable contains all information about the experience
		let infoTableRows = attrNames.map( (attr) => {
			//makes the first letter capital
			let label = attr.charAt(0).toUpperCase() + attr.slice(1);
			let content = exp[attr];
			switch (attr) {
				case "usefulLinks":
					label = "Useful links";
					content = usefulLinks;
					break;
				case "budget":
					content = <span>{exp.budget.from}€-{exp.budget.to}€ Notes: {exp.budget.notes}</span>
					break;
				case "tags":
					content = tags;
					break;
				default:
					break;
			}
			return (
				<tr>
					<td>{label}: </td>
					<td>{content}</td>
				</tr>
			);
		});
		let deleteButton = "";
		if (this.props.db.getCurrentUser().username === exp.username) {
			deleteButton = <button className="delete-button" onClick={(e) => this.props.askForConfirmation("Do you really want to delete experience: \"" + exp.name + "\"?", this.deleteExp.bind(this))}><BsFillTrashFill /></button>
		}
		return (
			<div className="Tile-Dialog-flex">
				<div className="Tile-Dialog-column-info">
					<div style={{position: "relative"}}>
						<img className="main-img" src={exp.img} alt={exp.h1} onDoubleClick={(e) => this.handleImageDoubleClick()}></img>
						{likeHeart}
					</div>
					<div className="wrapper">
						<h2>{exp.name}</h2>
						<User user={this.props.db.getUser(exp.username)}/>
						<p><AiFillHeart/> {exp.likes.size}</p>
						{deleteButton}
						<table>
							<tbody>
								{infoTableRows}
							</tbody>
						</table>
					</div>
				</div>
				<div className="Tile-Dialog-column-comments">
					<div>
						<h3>Comments</h3>
						{this.props.db.getCurrentUser().username !== "Guest" 
							? <InputWithSend exp={exp} db={this.props.db} setState={this.setState.bind(this)}/> 
							: ""}
						{comments}
					</div>
				</div>
			</div>
		);
	}

	render() {
		const exp = this.props.exp;
		return (
			<Tile 
				type="withPopup" 
				img={exp.img} 
				h1={exp.name} 
				h2={exp.username} 
				likes={exp.likes.size}
				popupElement={this.generatePopup()}
				exp={exp}
			/>
		);
	}
}

export default withHooks(ExpTile);

/*

					<p>Country: {exp.country}</p>
					<p>City: {exp.city}</p>
					<p>Documentation: {exp.documentation}</p>
					<p>Budget: {exp.budget.from}€-{exp.budget.to}€ Notes: {exp.budget.notes}</p>
					<p>Transportation: {exp.transportation}</p>
					<p>Accomodation: {exp.accomodation}</p>
					<p>Useful links: {usefulLinks}</p>
*/