import React, { Component } from 'react';
import NavStyle from './style/navstyle.css';
import logo from './images/logo.png';
import { Link } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: []
    };
  }

  componentDidMount() {
    const data = [
      { id: 1, class: '', name: 'Project', path: '/project' },
      { id: 2, name: 'Backlog', path: '/backlog' },
      { id: 3, name: 'New task', path: '/newTask' },
      { id: 4, name: 'Planning', path: '/planning' },
      { id: 5, name: 'Active sprint', path: '/activeSprint' },
      { id: 6, name: 'Retrospective', path: '/retrospective' },
      { id: 7, name: 'Dashboard', path: '/dashboard' },
      { id: 8, name: 'Admin', path: '/admin' },
    ];
    // Update state
    this.setState({ menus: data });
  }

  render() {
    const menuNode = this.state.menus.map((menu) => {
      return (
        <li><Link to={menu.path} activeClassName="active" key={menu.id}> {menu.name}</Link></li>
      )
    });

    return (
      <div className="App" style={NavStyle}>
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
                  <li className="pull-left" id="slide-sidebar"><a href="#">Organization</a></li>
                  {menuNode}
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
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
