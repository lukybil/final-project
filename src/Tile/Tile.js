import React from "react";
import '../common.css';
import "./Tile.css";
import {AiFillHeart} from 'react-icons/all'
import Dialog from '@mui/material/Dialog';
import MySnackbar from "../MySnackbar";

class Tile extends React.Component{
	constructor(props) {
		super(props);
		this.state = {isPopupOpen: false};
	}

	handlePopupClose() {
		this.setState({isPopupOpen: false});
	}

	generatePopup() {
		return (
			<div>
				<img src={this.props.img} alt={this.props.h1}></img>
				<h2>{this.props.h1}</h2>
				<div>{this.props.likes}</div>
			</div>
		);
	}

	render() {
		let likes;
		if (this.props.likes !== undefined) {
			likes = (
				<span className="Tile-likes"><AiFillHeart/>{this.props.likes}</span>
			);
		}
		return (
			<div 
				className="Tile" 
				onClick={this.props.type === "exp" ? 
				((e) => {
						if (!this.state.isPopupOpen)
								this.setState({isPopupOpen: true});
				}) 
				: undefined}
			>
				<img src={this.props.img} alt={this.props.h1} className="Tile-img"></img>
				<span className="Tile-h2">{this.props.h2}</span>
				<span className="Tile-h1">{this.props.h1}</span>
				{likes}
				<Dialog
					open={this.state.isPopupOpen}
					onClose={this.handlePopupClose.bind(this)}
					scroll={'paper'}
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					maxWidth="lg"
					className="Tile-dialog"
				>
					{this.props.popupElement !== undefined ? this.props.popupElement : this.generatePopup()}
				</Dialog>
			</div>
		);
	}
}


export class ExpTile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isHeartPresent: false, snackbar: {open: false, severity: "info", message: ""}};
	}

	static checkExpProps(props) {
		if (typeof props !== 'object' ||
		Array.isArray(props) ||
		props === null)
		{	
			props = {};
		}
		let propNames = ["id", "name", "country", "city", "username", "documentation", "budget", "transportation", "accomodation"];
		propNames.forEach( (prop) => {
			if (props[prop] === undefined) {
				props[prop] = "";
			}
		})
		if (props.likes === undefined || !props.likes instanceof Set) {
			props.likes = new Set();
		}
		if (props.usefulLinks === undefined || !Array.isArray(props.usefulLinks)) {
			props.usefulLinks = [];
		}
		if (props.comments === undefined || !Array.isArray(props.comments)) {
			props.comments = [];
		}
		return props;
	}

	generateComment(props) {
		return (
			<div className="Tile-Dialog-Comment">
				<span>@{props.username}</span><span> {props.date}</span>
				<p>{props.content}</p>
			</div>
		);
	}

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
		this.setState({snackbar: {open: true, severity: "error", message: "You have to sign in to perform that action."}});
	}

	handleSnackbarClose() {
		this.setState({snackbar: {open: false, severity: this.state.snackbar.severity, message: ""}})
	}

	generatePopup() {
		let snackbar = this.state.snackbar;
		const exp = this.props.exp;
		let usefulLinks = exp.usefulLinks.map( (link) => {
			return <span><a href={link}>{link}</a><br></br></span>
		});
		let comments = exp.comments.map( (comment) => {
			return this.generateComment(comment);
		});
		let likeHeart = "";
		if (this.state.isHeartPresent)
			likeHeart = <AiFillHeart className="big-heart"/>
		let attrNames = ["country", "city", "documentation", "budget", "transportation", "accomodation", "usefulLinks"];
		let infoTableRows = attrNames.map( (attr) => {
			let label = attr.charAt(0).toUpperCase() + attr.slice(1);
			let content = exp[attr];
			switch (attr) {
				case "usefulLinks":
					label = "Useful links";
					content = usefulLinks;
					break;
				case "budget":
					content = <span>Budget: {exp.budget.from}€-{exp.budget.to}€ Notes: {exp.budget.notes}</span>
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
		return (
			<div className="Tile-Dialog-flex">
				<div className="Tile-Dialog-column-info">
					<div style={{position: "relative"}}>
						<img src={exp.img} alt={exp.h1} onDoubleClick={(e) => this.handleImageDoubleClick()}></img>
						{likeHeart}
					</div>
					<h2>{exp.name}</h2>
					<h3>@{exp.username}</h3>
					<p><AiFillHeart/> {exp.likes.size}</p>
					<table>
						<tbody>
							{infoTableRows}
						</tbody>
					</table>
				</div>
				<div className="Tile-Dialog-column-comments">
					<div>
						<h3>Comments</h3>
						{comments}
					</div>
				</div>
				<MySnackbar //to tell user to login
					open={snackbar.open} 
					onClose={this.handleSnackbarClose.bind(this)} 
					message={snackbar.message} 
					severity={snackbar.severity}
				/>
			</div>
		);
	}

	render() {
		const exp = this.props.exp;
		return (
			<Tile 
				type="exp" 
				img={exp.img} 
				h1={exp.city} 
				h2={exp.username} 
				likes={exp.likes.size}
				popupElement={this.generatePopup()}
			/>
		);
	}
}

export default Tile;

/*

					<p>Country: {exp.country}</p>
					<p>City: {exp.city}</p>
					<p>Documentation: {exp.documentation}</p>
					<p>Budget: {exp.budget.from}€-{exp.budget.to}€ Notes: {exp.budget.notes}</p>
					<p>Transportation: {exp.transportation}</p>
					<p>Accomodation: {exp.accomodation}</p>
					<p>Useful links: {usefulLinks}</p>
*/