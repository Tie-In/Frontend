import React, { Component } from 'react';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';
import { Link } from 'react-router';
import 'simple-line-icons/css/simple-line-icons.css';

class StartNavbar extends Component {
  render() {
    return (
      <div style={NavStyle}>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <img id="logo-main" src={logo} alt="Logo Thing main logo" />
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-primary-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
              </div>
              <div className="collapse navbar-collapse" id="navbar-primary-collapse">
                <ul className="nav navbar-nav">
                  <li>
                    <Link to="/login" activeClassName="active">
                      <b>Tie-In</b>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default StartNavbar;
