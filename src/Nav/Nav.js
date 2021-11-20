import React from "react";
import '../common.css';
import './Nav.css';
import Dialog from '@mui/material/Dialog';
import SignIn from '../SignIn/SignIn';
import MySnackbar from "../MySnackbar";
import {Brand} from "../App";
import {NavLink, Routes, Route} from 'react-router-dom';
import { UserAvatar } from "../User/User";
import UserMenu from '../UserMenu/UserMenu';


function NavButton(props) {
  return (
    <button 
      className="Nav-button"
    >{props.text}
    </button>
  );
}

function SignInButton(props) {
  return (
    <button className="Nav-button Nav-signIn-button" onClick={props.onClick}>Sign In</button>
  );
}



class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      isSignInOpen: false,
      isUserMenuOpen: false,
      snackbar: {open: false, severity: "info", message: ""}
    };
  }

  generateMenuButton(name, isSelected) {
    return (
      <li>
        <NavLink to={(name !== "Home" ? name.toLowerCase() : "/")} activeClassName="Nav-button-selected">
          <NavButton 
            text={name} 
            isSelected={isSelected}
          />
        </NavLink>
      </li>
    );
  }

  generateSignInButton() {
    return (
      <li>
        <SignInButton onClick={(e) => {if (!this.state.isSignInOpen) this.setState({isSignInOpen: true})}}/>
      </li>
    );
  }

  handleSignInClose() {
    this.setState({isSignInOpen: false});
  }

	handleSnackbarClose() {
		this.setState({snackbar: {open: false, severity: this.state.snackbar.severity}});
	}

  openSettings() {

  }

  handleSignOut() {
    this.props.db.logoutUser();
    this.setState({
      isUserMenuOpen: false, 
      snackbar: {open: true, severity: "success", message: "Bye!"}
    });
  }

  handleEditProfile() {

  }

  render() {
    let user = this.props.db.getCurrentUser();
    let names = ["Home", "Destinations", "Experiences"];
    let snackbar = this.state.snackbar;
    let userPanel;
    let userMenu = 
      <UserMenu
        open={this.state.isUserMenuOpen}
        user={user}
        db={this.props.db}
        handleEditProfile={this.handleEditProfile.bind(this)}
        handleSignOut={this.handleSignOut.bind(this)} 
        handleSettings={this.openSettings.bind(this)}
        handleClickAway={(e) => {this.setState({isUserMenuOpen: false})}}
      />;
    let loggedIn = user.username !== "Guest";
    if (!loggedIn) { //Guest
      userPanel = (
        <li className="Nav-user">
          <div className="wrapper">
            <UserAvatar user={user} />
            <span className="Nav-username">{user.username}</span>
          </div>
        </li>
      );
    }
    else { //Registered user
      userPanel = (
        <li className="Nav-user">
          <div className="wrapper">
            <button onClick={(e) => { this.setState({isUserMenuOpen: true}) }}>
              <UserAvatar user={user} db={this.props.db}/>
              <span className="Nav-username">{user.username}</span>
            </button>
          </div>
          {this.state.isUserMenuOpen ? userMenu : ""}
          {console.log(this.state.isUserMenuOpen)}
        </li>
      );
    }
    return (
      <nav>
        <Routes>
          <Route path="/" />
          <Route path="/*" element={<Brand/>}/>
        </Routes>
        <ul>
          {this.generateMenuButton(names[0], this.state.page===names[0])}
          {this.generateMenuButton(names[1], this.state.page===names[1])}
          {this.generateMenuButton(names[2], this.state.page===names[2])}
          {!loggedIn ? this.generateSignInButton() : ""}
          {userPanel}
        </ul>
        <Dialog
					open={this.state.isSignInOpen}
					onClose={this.handleSignInClose.bind(this)}
					scroll={'body'}
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					maxWidth="md"
					className="Nav-Dialog"
				>
          <SignIn db={this.props.db} setNavState={this.setState.bind(this)}/>
				</Dialog>
				<MySnackbar 
					open={snackbar.open} 
					onClose={this.handleSnackbarClose.bind(this)} 
					message={snackbar.message} 
					severity={snackbar.severity}
				/>
      </nav>
    );
  }
}

export default Nav;