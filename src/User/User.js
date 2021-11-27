import React from "react";
import './User.css';
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

export function UserAvatar(props) {
  if (props.user.profileImg === "") {
    return (
      <span className="UserAvatar" style={{backgroundColor: props.user.defaultAvatarColor}}>
        <span>{props.user.username.charAt(0).toUpperCase()}</span>
      </span>
    );
  }
  else {
    return (
      <img className="UserAvatar" src={props.user.profileImg} alt="User avatar"/>
    );
  }
}

class User extends React.Component {


  render() {
    let user = this.props.user;
    let isWithUserCard = this.props.isWithUserCard === undefined ? true : false;
    let userCard = "";
    if (user === undefined) {
      return <span>User undefined</span>;
    }
    if (isWithUserCard) {
      userCard = (
        <div className="User-card">
          <UserAvatar user={user}/>
          <span>{user.username}</span>
          <span><AiFillHeart/>{user.numberLikes}</span>
        </div>
      );
    }
    return (
      <div className="User">
        <Link to={`/userProfile/${user.username}`}>
          <span>
            <UserAvatar user={user}/>
            <span className="username">{user.username}</span>
          </span>
          {userCard}
        </Link>
      </div>
    );
  }
}

export default User