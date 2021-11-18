import './common.css';
import './App.css';
import DB from './DB';
import logo from './img/logo_placeholder.png';
import Nav from './Nav/Nav';
import React from 'react';
import Home from './Home/Home';
import Experiences from './Experiences/Experiences';

function Logo(props) {
  return (
    <img src={logo} alt="logo" className="Logo"></img>
  );
}

export function Brand(props) {
  return (
    <span className="Brand">
      <Logo/>
      <h1>Travelify</h1>
    </span>
  );
}

function Header() {
  return (
    <header>
      <div className="header-flex">
        <div className="header-column-logo">
          <Brand/>          
        </div>
        <div className="header-column-phrase">
          <span className="phrase">"Discover your next adventure on Travelify"</span>
        </div>
      </div>
    </header>
  );
}

function setDbBeforeUnload(db) {
  window.onbeforeunload = (e) => {
    db.saveIntoLocalStorage();
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.db = new DB(this.setCurrentUser.bind(this))
    this.state = {pageName: "Home", user: this.db.getCurrentUser(), isDatabaseLoaded: false};
  }

  setCurrentUser(newUser) {
    this.setState({user: newUser});
    console.log("User changed to " + newUser.username);
  }

  componentDidMount() {
    this.db.loadFromLocalStorage();
    this.setState({isDatabaseLoaded: true});
    setDbBeforeUnload(this.db);
 }

  handlePageChange(pageName) {
    if (this.state.pageName !== pageName) {
      this.setState({pageName: pageName})
    }
  }

  render() {
    let pageContent;
    switch(this.state.pageName) {
      case "Home":
        pageContent = <Home/>;
        break;
      case "Destinations":
        pageContent = 
          <span>Destinations</span>
        break;
      case "Experiences":
        pageContent = 
          pageContent = <Experiences db={this.db} />
        break;
      default:
        break;
    }
    return (
      <div className="App">
        {this.state.pageName === "Home" ? <Header/> : ""}
        <Nav db={this.db} onPageChange={this.handlePageChange.bind(this)}/>
        {pageContent}
      </div>
    );
  };
}

export default App;
