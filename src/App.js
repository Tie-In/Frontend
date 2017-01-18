import React, { Component } from 'react';
import NavStyle from './style/navstyle.css';
//import { Button, Navbar, FormGroup, FormControl, NavDropdown, Nav, NavItem, MenuItem } from 'react-bootstrap';
import logo from './images/logo.png';

class App extends Component {
  render() {
    return (
      <div className="App" style={NavStyle}>
        <div className="container">
          {this.props.children}
        </div>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <img id="logo-main" src={logo} alt="Logo Thing main logo"></img>
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-primary-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
              </div>
              <div className="collapse navbar-collapse" id="navbar-primary-collapse">
                <ul className="nav navbar-nav">
                  <li className="pull-left"><a href="#">Organization</a></li>
                  <li className="active"><a href="#">Project</a></li>
                  <li><a href="#">Backlog</a></li>
                  <li><a href="#">New task</a></li>
                  <li><a href="#">Planning</a></li>
                  <li><a href="#">Active sprint</a></li>
                  <li><a href="#">Retrospective</a></li>
                  <li><a href="#">Dashboard</a></li>
                  <li><a href="#">Admin</a></li>
                  <div className="searchBox input-group pull-right">
                    <input type="text" className="form-control" placeholder="Search"></input>
                    <span className="input-group-btn">
                      <button className="btn" type="submit">
                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                      </button>
                    </span>
                  </div>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default App;
