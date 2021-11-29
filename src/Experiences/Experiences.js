import React from "react";
import Grid from "@mui/material/Grid";
import User from "../User/User";
import ExpTile, {checkExpAndFill} from "../Tile/Tile";
import '../common.css';
import "../Home/Home.css";
import "./Experiences.css";
import {AiFillHeart} from 'react-icons/all'
import Dialog from '@mui/material/Dialog';
import NewExperience from "../NewExperience/NewExperience";
import withHooks from '../withHooks';
import restrictAccess from '../decorators/restrictAccess';

/*
This is the experiences menu page, at /experiences
*/

/**
 * User row in the table for UserRanking
 */
function UserRow(props) {
	return (
		<tr className="UserRow" key={props.user.username}>
			<td><User user={props.user}/></td>
			<td>{props.user.numberLikes}<AiFillHeart className="AiFillHeart"/></td>
		</tr>
	);
}

/**
 * User ranking table, ranks users based on the accumulated number of likes among their experiences
*/
function UserRanking(props) {
	let users = props.topUsers.map( (user) => {
		return <UserRow user={user}/>
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
/**
 * Experiences class for showing 4 best rated experiences and the UserRanking
 */
class Experiences extends React.Component {
	constructor(props) {
		super(props);
		this.db = props.db;
		this.state = {isNewExpOpen: false};
	}

	componentDidMount() { //updates itself, for the UserRanking to update
		this.interval = setInterval(() => this.setState({}), 0.2 * 60 * 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	handlePopupClose() { //generic method for closing popups
		this.setState({isNewExpOpen: false});
	}

  	render() {
		let topExp = [];
		topExp = this.db.getTopExp(4); //gete 4 top experiences from the database to show in the grid
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
								<ExpTile exp={checkExpAndFill(topExp.length >= 1 ? topExp[0] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={5}>
								<ExpTile exp={checkExpAndFill(topExp.length >= 2 ? topExp[1] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={8}>
								<ExpTile exp={checkExpAndFill(topExp.length >= 3 ? topExp[2] : {})} db={this.db} />
							</Grid>
							<Grid item xs={12} md={4}>
								<ExpTile exp={checkExpAndFill(topExp.length >= 4 ? topExp[3] : {})} db={this.db} />
							</Grid>
						</Grid>
					</div>
					<div className="main-column-users">
						<aside>
							<button
								className="button-primary"
								onClick={(e) => {
									restrictAccess(this.db, this.props.addSnackbar, (e) => this.setState({isNewExpOpen: true}));
								}}
							>
								Add experience
							</button>
							<UserRanking topUsers={this.db.getTopUsers(10)}/>
						</aside>
					</div>
				</div>
				<Dialog //dialog object for showing the NewExperience form on add experience button click
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

export default withHooks(Experiences);