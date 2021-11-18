import React from "react";
import '../common.css';
import './Nav.css';
import Dialog from '@mui/material/Dialog';
import SignIn from '../SignIn/SignIn';
import MySnackbar from "../MySnackbar";
import {Brand} from "../App";

import { BiExit } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import ClickAwayListener from "@mui/core/ClickAwayListener";


function NavButton(props) {
  return (
    <button 
      className={"Nav-button" + (props.isSelected ? " Nav-button-selected" : "")} 
      onClick={props.onClick}>{props.text}
    </button>
  );
}

function SignInButton(props) {
  return (
    <button className="Nav-button Nav-signIn-button" onClick={props.onClick}>Sign In</button>
  );
}

function UserMenu(props) {
  return (
    <ClickAwayListener onClickAway={props.handleClickAway}>
      <div className="UserMenu">
        <div className="UserMenu-flex">
          <h3>{props.user.username}</h3>
          <img src={props.user.profileImg} alt="User"/>
          <hr/>
          <button onClick={props.handleSettings}>Settings <IoMdSettings/></button>
          <button onClick={props.handleSignOut} className="button-logout">Sign out <BiExit/></button>
        </div>
      </div>
    </ClickAwayListener>
  );
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false, 
      page: "Home", 
      isSignInOpen: false,
      isUserMenuOpen: false,
      snackbar: {open: false, severity: "info", message: ""}
    };
  }

  generateMenuButton(name, isSelected) {
    return (
      <li>
        <NavButton 
          text={name} 
          isSelected={isSelected} 
          onClick={() => {
            this.props.onPageChange(name);
            this.setState({page: name});
          }}
        />
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

  render() {
    let user = this.props.db.getCurrentUser();
    let names = ["Home", "Destinations", "Experiences"];
    let snackbar = this.state.snackbar;
    let userPanel;
    let userMenu = 
      <UserMenu
        open={this.state.isUserMenuOpen}
        user={user} 
        handleSignOut={this.handleSignOut.bind(this)} 
        handleSettings={this.openSettings.bind(this)}
        handleClickAway={(e) => {this.setState({isUserMenuOpen: false})}}
      />;
    let loggedIn = user.username !== "Guest";
    if (!loggedIn) { //Guest
      userPanel = (
        <li className="Nav-user">
          <img src={user.profileImg} alt="Profile"></img>
          <span>{user.username}</span>
        </li>
      );
    }
    else { //Registered user
      userPanel = (
        <li className="Nav-user">
          <button onClick={(e) => { this.setState({isUserMenuOpen: true}) }}>
            <img src={user.profileImg} alt="Profile"></img>
            <span>{user.username}</span>
          </button>
          {this.state.isUserMenuOpen ? userMenu : ""}
          {console.log(this.state.isUserMenuOpen)}
        </li>
      );
    }
    return (
      <nav>
        {this.state.page !== "Home" ? <Brand/> : ""}
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