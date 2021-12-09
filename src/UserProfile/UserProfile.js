import React from 'react';
import '../common.css';
import './UserProfile.css';

import Grid from "@mui/material/Grid";
import ExpTile, {checkExpAndFill} from "../Tile/Tile";
import { useParams } from 'react-router';
import { UserAvatar } from '../User/User';
import { Tabs, Tab } from '@mui/material';
import withHooks from '../withHooks';
import DialogButton from '../DialogButton/DialogButton';
import NewExperience from '../NewExperience/NewExperience';
import NewCollection from '../NewCollection/NewCollection';
import { CollectionTile } from '../Tile/Tile';
//import {withRouter} from '../App';

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
    this.state = {user: this.props.db.getCurrentUser(), tabValue: "experiences"};
  }

  handleTabChange(e, newValue) {
    this.setState({tabValue: newValue});
  }

  render() {
    let params = this.props.params;
    let viewedUser = this.props.db.getUser(params.username);
    let content;
    if (this.state.tabValue === "experiences") {
      let topUserExp = this.props.db.getTopExpByUser(params.username, 4);
      content = (
        <div>
          {viewedUser.username === this.props.db.getCurrentUser().username && 
            <DialogButton db={this.props.db} text="Add experience">
              <NewExperience db={this.props.db}/>
            </DialogButton>
          }
          {topUserExp.length < 1 && <h4>{viewedUser.username} does not have any experiences yet!</h4>}
          <Grid container spacing={2} className="main-Grid-container">
            <Grid item xs={12} md={7}>
              <ExpTile exp={checkExpAndFill(topUserExp.length >= 1 ? topUserExp[0] : {})} db={this.props.db} />
            </Grid>
            <Grid item xs={12} md={5}>
              <ExpTile exp={checkExpAndFill(topUserExp.length >= 2 ? topUserExp[1] : {})} db={this.props.db} />
            </Grid>
            {topUserExp.length >= 3 && <Grid item xs={12} md={8}>
              <ExpTile exp={checkExpAndFill(topUserExp.length >= 3 ? topUserExp[2] : {})} db={this.props.db} />
            </Grid>}
            {topUserExp.length >= 4 && <Grid item xs={12} md={4}>
              <ExpTile exp={checkExpAndFill(topUserExp.length >= 4 ? topUserExp[3] : {})} db={this.props.db} />
            </Grid>}
          </Grid>
        </div>
      );
    }
    else {
      let userCollections = this.props.db.getCollectionsByUser(params.username, -1);
      console.log({userCollections});
      content = (
        <div>
          { viewedUser.username === this.props.db.getCurrentUser().username && 
            <DialogButton db={this.props.db} text="Add collection">
              <NewCollection db={this.props.db}/>
            </DialogButton>
          }
          {userCollections.length < 1 && <h4>{viewedUser.username} does not have any collection yet!</h4>}
          <Grid container spacing={2} className="main-Grid-container">
            <Grid item xs={12} md={7}>
              <CollectionTile collection={userCollections.length > 0 && userCollections[0]} db={this.props.db} />
            </Grid>
            <Grid item xs={12} md={5}>
              <CollectionTile collection={userCollections.length > 1 && userCollections[1]} db={this.props.db} />
            </Grid>
            {userCollections.length > 2 && <Grid item xs={12} md={8}>
              <CollectionTile collection={userCollections.length > 2 && userCollections[2]} db={this.props.db} />
            </Grid>}
            {userCollections.length > 3 && <Grid item xs={12} md={4}>
              <CollectionTile collection={userCollections.length > 3 && userCollections[3]} db={this.props.db} />
            </Grid>}
          </Grid>
        </div>
      );
    }
    return (
		<main className="UserProfile">
			<h2><UserAvatar user={viewedUser} />{params.username+"'s profile"}</h2>
      <Tabs
        value={this.state.tabValue}
        onChange={this.handleTabChange.bind(this)}
        TabIndicatorProps={{style: {backgroundColor: "var(--color-primary)"}}}
        textColor="inherit"
        style={{color: "var(--color-primary)"}}
        aria-label="experiences and collection tabs"
        classes={{root: "Tabs"}}
      >
        <Tab value="experiences" label="Experiences" />
        <Tab value="collections" label="Collections" />
      </Tabs>
			<div className="main-Grid-wrapper">
        {content}
      </div>
		</main>
	);
  }
}

export default withHooks(withRouter(UserProfile));