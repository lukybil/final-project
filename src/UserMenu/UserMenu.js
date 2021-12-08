import React from 'react';

import '../common.css';
import '../User/User.css';
import './UserMenu.css';

import Dialog from '@mui/material/Dialog';
import User from "../User/User";

import { BiExit } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import ClickAwayListener from "@mui/core/ClickAwayListener";
import withHooks from '../withHooks';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfileOpen: false, 
      mixedColors: this.props.user.defaultAvatarColor, 
      newProfileImg: this.props.user.profileImg
    };
  }

  handleEditProfile() {
    this.setState({isEditProfileOpen: true});
  }

  handleEditProfileClose() {
    this.setState({isEditProfileOpen: false, mixedColors: this.props.user.defaultAvatarColor});
  }

  getValueByName(name) {
    return document.querySelector("input[name=" + name + "]")?.value;
  }

  onEditProfileSubmit(e) {
    e.preventDefault();
    if (this.props.db.getUser(this.props.user.username).password !== this.getValueByName("currentPassword")) {
      this.props.addSnackbar("error", "Wrong current password.");
      return;
    }
    let newUser = JSON.parse(JSON.stringify(this.props.db.getUser(this.props.user.username)));
    let attributes = ["defaultAvatarColor", "profileImg"];
    attributes.forEach( (attr) => {
			newUser[attr] = document.querySelector(".UserMenu-Dialog input[name=" + attr + "]")?.value;
		});
    let password;
    if ((password = this.getValueByName("password")) !== "") {
      if (password === this.getValueByName("confirmPassword")) {
        newUser.password = password;
      }
      else {
        this.props.addSnackbar("error", "New passwords do not match");
        return;
      }
    }
    
    this.props.db.updateUser(newUser);
    this.props.addSnackbar("success", "User data updated.");
  }

  onColorChange(e) {
    /*let red = document.querySelector(".UserMenu-Dialog input[name=red]")?.value || 0;
    let green = document.querySelector(".UserMenu-Dialog input[name=green]")?.value || 0;
    let blue = document.querySelector(".UserMenu-Dialog input[name=blue]")?.value || 0;
    this.setState({mixedColors: `rgb(${red},${green},${blue})`});*/
    this.setState({mixedColors: e.target.value});
  }

  onProfileImgChange(e) {
    this.setState({newProfileImg: e.target.value});
  }

  render() {
    let props = this.props;
    let user = this.props.user;
    return (
      <ClickAwayListener onClickAway={props.handleClickAway}>
        <div>
          <div className="UserMenu">
            <div className="UserMenu-flex">
              <User user={user} isWithUserCard={false} />
              <hr/>
              <button onClick={this.handleEditProfile.bind(this)}>Edit profile <FiEdit/></button>
              <button onClick={props.handleSettings}>Settings <IoMdSettings/></button>
              <button onClick={props.handleSignOut} className="button-logout">Sign out <BiExit/></button>
            </div>
          </div>
          <Dialog
                open={this.state.isEditProfileOpen}
                onClose={this.handleEditProfileClose.bind(this)}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="md"
                className="UserMenu-Dialog"
          >
            <div className="form-dialog">
              <h2>Edit Profile</h2>
              <form>
                <div className="flex">
                  <input name="username" placeholder="Username" value={user.username} disabled/>
                  <input name="email" placeholder="Email" value={user.email} disabled/>
                  <input type="password" name="currentPassword" placeholder="Current password" />
                  <input type="password" name="password" placeholder="Password" />
                  <input type="password" name="confirmPassword" placeholder="Confirm password" />
                  <div>
                    <span>Avatar color: </span>
                    <label>
                      <input type="color" name="defaultAvatarColor" value={this.state.mixedColors} onChange={this.onColorChange.bind(this)}/>
                      <span className="defaultAvatarPreview UserAvatar" style={{backgroundColor: this.state.mixedColors}}>{user.username.charAt(0).toUpperCase()}</span>
                    </label>
                  </div>
                  <span className="input-wrapper">
                    <input name="profileImg" placeholder="Profile image" value={this.state.newProfileImg} onClick={(e) => e.target.select()} onChange={this.onProfileImgChange.bind(this)}/>
                    <img src={this.state.newProfileImg} alt="" className="UserAvatar"/>
                  </span>
                  <button className="button-submit" onClick={this.onEditProfileSubmit.bind(this)}>Save changes</button>
                </div>
              </form>
            </div>
          </Dialog>
        </div>
      </ClickAwayListener>
    );
  }
  
}

export default withHooks(UserMenu);

/*
<input type="number" className="input-avatar-color" name="red" min="0" max="255" placeholder="R" onChange={this.onColorChange.bind(this)}/>
                    <input type="number" className="input-avatar-color" name="green" min="0" max="255" placeholder="G" onChange={this.onColorChange.bind(this)}/>
                    <input type="number" className="input-avatar-color" name="blue" min="0" max="255" placeholder="B" onChange={this.onColorChange.bind(this)}/>
*/