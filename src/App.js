import './common.css';
import './App.css';
import DB from './DB';
import logo from './img/logo_placeholder.png';
import Nav from './Nav/Nav';
import React from 'react';
import Home from './Home/Home';
import Experiences from './Experiences/Experiences';
import {Routes , Route} from 'react-router-dom';
import UserProfile from './UserProfile/UserProfile';
import Footer from './Footer/Footer';
import NotificationInterface from './NotificationProvider/NotificationInterface';
import NotificationProvider from './NotificationProvider/NotificationProvider';

export function Logo(props) {
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

export function Header() {
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
    this.state = {user: this.db.getCurrentUser(), isDatabaseLoaded: false};
    console.log(this.props);
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

  render() {
    let pageContent;
    return (
      <NotificationProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Header/>}/>
          </Routes>
          <Nav db={this.db}/>
          <Routes >
            <Route path="/destinations" element={<span>Destinations</span>}/>
            <Route path="/experiences" element={<Experiences db={this.db}/>}/>
            <Route path="/userProfile/:username" element={<UserProfile db={this.db}/>}/>      
            <Route path="/" element={<Home/>} />
          </Routes >
          {pageContent}
        </div>
        <Footer />
        <NotificationInterface />
      </NotificationProvider>
    );
  };
}

export default App;
