import React from 'react';
import '../common.css';
import './UserProfile.css';

import Grid from "@mui/material/Grid";
import {ExpTile} from "../Tile/Tile";
import { useParams } from 'react-router';
import { UserAvatar } from '../User/User';
//import {withRouter} from '../App';

import Athens from "../img/content/athens.jpg";
import Madrid from "../img/content/madrid.jpg";
import Vienna from "../img/content/vienna.jpg";
import London from "../img/content/london.jpg";

export const withRouter = WrappedComponent => props => {
  const params = useParams();
  return (
    <WrappedComponent
      {...props}
      params={params}
    />
  );
};

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: this.props.db.getCurrentUser()};
  }
  render() {
    let params = this.props.params;
    let topUserExp = this.props.db.getTopExpByUser(params.username, 4);
    let viewedUser = this.props.db.getUser(params.username)
    return (
		<main className="UserProfile">
				<h2><UserAvatar user={viewedUser} />{params.username+"'s profile"}</h2>
				<div className="main-Grid-wrapper">
            <Grid container spacing={2} className="main-Grid-container">
							<Grid item xs={12} md={7}>
								<ExpTile exp={ExpTile.checkExpAndFill(topUserExp.length >= 1 ? topUserExp[0] : {})} db={this.props.db} />
							</Grid>
							<Grid item xs={12} md={5}>
								<ExpTile exp={ExpTile.checkExpAndFill(topUserExp.length >= 2 ? topUserExp[1] : {})} db={this.props.db} />
							</Grid>
							<Grid item xs={12} md={8}>
								<ExpTile exp={ExpTile.checkExpAndFill(topUserExp.length >= 3 ? topUserExp[2] : {})} db={this.props.db} />
							</Grid>
							<Grid item xs={12} md={4}>
								<ExpTile exp={ExpTile.checkExpAndFill(topUserExp.length >= 4 ? topUserExp[3] : {})} db={this.props.db} />
							</Grid>
						</Grid>
				</div>
		</main>
	);
  }
}

export default withRouter(UserProfile);