import React, { Component } from 'react';
import 'simple-line-icons/css/simple-line-icons.css';
import logo from '../../images/logo.png';
import './navstyle.css';

class StartNavbar extends Component {
  render() {
    return (
      <div>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <img id="logo-main" src={logo} alt="Logo" />
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default StartNavbar;
