import React, { Component } from 'react';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';
import { Link } from 'react-router';
import 'simple-line-icons/css/simple-line-icons.css';

class NormalNavbar extends Component {
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
                  <li className="pull-left" id="slide-sidebar"><a href="#sidebar-nav">Organization <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span></a></li>
                  {menuNode}
                  <div className="searchBox input-group pull-right">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="input-group-btn">
                      <button className="btn" type="submit">
                        <span className="glyphicon glyphicon-search" aria-hidden="true" />
                      </button>
                    </span>
                  </div>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <nav id="sidebar-nav">
          <ul id="sidebar-nav-list">
            <li className="sidebar-nav-item"><a href="#">Organization A</a></li>
            <li className="sidebar-nav-item"><a href="#">Organization B</a></li>
            <li className="sidebar-nav-item"><a href="#">Organization A</a></li>
            <li className="sidebar-nav-item"><a href="#">Organization B</a></li>
            <li className="sidebar-nav-item" id="createOrg">
              <a href="#"><span className="icon-plus" />
                Create organization
              </a>
            </li>
          </ul>
        </nav>
        <a id="nav-screen-overlay" href="#"></a>
      </div>
    );
  }
}

export default NormalNavbar;
