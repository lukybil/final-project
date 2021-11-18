import React from "react";
import Grid from "@mui/material/Grid";
import Tile from "../Tile/Tile";
import {ExpTile} from "../Tile/Tile";
import '../common.css';
import "../Home/Home.css";
import "./Experiences.css";
import {AiFillHeart} from 'react-icons/all'
import Dialog from '@mui/material/Dialog';
import NewExperience from "../NewExperience/NewExperience";

function UserRow(props) {
	return (
		<tr className="UserRow" key={props.username}>
			<td>{props.username}</td>
			<td>{props.numberLikes}<AiFillHeart className="AiFillHeart"/></td>
		</tr>
	);
}

function UserRanking(props) {
	let users = props.topUsers.map( (user) => {
		return <UserRow username={user.username} numberLikes={user.numberLikes} />
	});
	return (
		<table className="UserRanking">
			<thead>
				<tr className="UserRow">
					<th>Username</th>
					<th>Likes</th>
				</tr>
			</thead>
			<tbody>
				{users}
			</tbody>
		</table>
	);
}

class Experiences extends React.Component {
	constructor(props) {
		super(props);
		this.db = props.db;
		this.state = {isNewExpOpen: false};
	}

	componentDidMount() {
		this.interval = setInterval(() => this.setState({}), 3 * 60 * 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	handlePopupClose() {
		this.setState({isNewExpOpen: false});
	}

  	render() {
		let topExp = [];
		topExp = this.db.getTopExp(4);
		return (
			<main className="Experiences">
				<h2>Experiences</h2>
				<form>
					<input type="text" className="main-search" placeholder="author, name, location,..."/>
				</form>
				<div className="main-flex">
					<div className="main-Grid-wrapper main-column-grid">
						<Grid container spacing={2} className="main-Grid-container">
							<Grid item xs={12} md={7}>
								<ExpTile exp={ExpTile.checkExpProps(topExp.length >= 1 ? topExp[0] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={5}>
								<ExpTile exp={ExpTile.checkExpProps(topExp.length >= 2 ? topExp[1] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={8}>
								<ExpTile exp={ExpTile.checkExpProps(topExp.length >= 3 ? topExp[2] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={4}>
								<ExpTile exp={ExpTile.checkExpProps(topExp.length >= 4 ? topExp[3] : {})} db={this.db} />
							</Grid>
						</Grid>
					</div>
					<div className="main-column-users">
						<aside>
							<button
								className="button-primary"
								onClick={(e) => {
									if (!this.state.isNewExpOpen)
										this.setState({isNewExpOpen: true});
								}}
							>
								Add experience
							</button>
							<UserRanking topUsers={this.db.getTopUsers(10)}/>
						</aside>
					</div>
				</div>
				<Dialog
					open={this.state.isNewExpOpen}
					onClose={this.handlePopupClose.bind(this)}
					scroll={'paper'}
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					maxWidth="lg"
					className="Tile-dialog"
				>
					<NewExperience db={this.db}/>
				</Dialog>
			</main>
		);
	}
}

export default Experiences;