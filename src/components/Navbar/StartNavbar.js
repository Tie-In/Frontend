import React, { Component } from 'react';
import 'simple-line-icons/css/simple-line-icons.css';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';

class StartNavbar extends Component {
  render() {
    const custom = {
      height: '70px',
    };
    return (
      <div style={NavStyle}>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" style={custom} role="navigation">
            <div className="container-fluid">
              <img id="logo-main" src={logo} alt="Logo Thing main logo" />
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default StartNavbar;
