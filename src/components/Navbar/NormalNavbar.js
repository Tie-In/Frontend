import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import 'simple-line-icons/css/simple-line-icons.css';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';
import user1 from '../../images/user1.png';

class NormalNavbar extends Component {

  logout() {
    localStorage.clear();
    document.location.href = '/login';
  }

  render() {
    const path = `/organizations/${this.props.organization.id}/projects/${this.props.project.id}`;
    const data = [
      { id: 1, name: 'Project', path: `${path}#` },
      { id: 2, name: 'Backlog', path: '/backlog' },
      { id: 3, name: 'New task', path: `${path}/tasks/new` },
      { id: 4, name: 'Planning', path: `${path}/planning` },
      { id: 5, name: 'Active sprint', path: `${path}/board` },
      { id: 6, name: 'Retrospective', path: '/retrospective' },
      { id: 7, name: 'Dashboard', path: '/dashboard' },
    ];

    const menuNode = data.map((menu) => {
      return (
        <li key={menu.id}>
          <Link to={menu.path} activeClassName="active">{menu.name}</Link>
        </li>
      );
    });

    const organizationNodes = this.props.user.organizations.map((org) => {
      return (
        <li key={org.id} className="sidebar-nav-item">
          <a href={`/organizations/${org.id}`}>{org.name}</a>
        </li>
      );
    });

    return (
      <DocumentTitle title={this.props.project.name}>
        <div className="App" style={NavStyle}>
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
                    <li className="pull-left" id="slide-sidebar"><a href="#sidebar-nav">{this.props.organization.name}<span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span></a></li>
                    {menuNode}
                    <Dropdown className="pull-right" id="profile-dropdown">
                      <Dropdown.Toggle>
                        <img
                          id="avatar" role="presentation"
                          src={user1}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <MenuItem eventKey="1" href={`/organizations/${this.props.organization.id}/profile`}>Profile</MenuItem>
                        <MenuItem eventKey="2">Setting</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="3" onClick={this.logout}>Sign Out</MenuItem>
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* <div className="searchBox input-group pull-right">
                      <input type="text" className="form-control" placeholder="Search" />
                      <span className="input-group-btn">
                        <button className="btn" type="submit">
                          <span className="glyphicon glyphicon-search" aria-hidden="true" />
                        </button>
                      </span>
                    </div> */}
                  </ul>
                </div>
              </div>
            </nav>
          </header>
          <div id="sidebar-nav">
            <ul id="sidebar-nav-list">
              {organizationNodes}
              <li className="sidebar-nav-item">
                <a href="/organizations/new"><span className="icon-plus" /> Create organization</a>
              </li>
            </ul>
          </div>
          <a id="nav-screen-overlay" href="#" />
        </div>
      </DocumentTitle>
    );
  }
}

NormalNavbar.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    organization: state.organization,
    project: state.project,
  };
}

export default connect(mapStateToProps)(NormalNavbar);
