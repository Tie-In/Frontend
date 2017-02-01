import React, { PropTypes, Component } from 'react';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, MenuItem, ButtonToolbar } from 'react-bootstrap';
import avatar from '../../images/logo-login.png';
import 'simple-line-icons/css/simple-line-icons.css';
import * as userActions from '../../actions/user-actions';

class OrganizationNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: []
    };
  }

  logout() {
    localStorage.clear();
    document.location.href = '/login';
  }

  render() {
    const customStyle = {
      height: '70px',
    };
    const sidebarStyle = {
      top: '70px',
    };
    const organizationsFromUser = this.props.user.organizations || [];
    const organizationNodes = organizationsFromUser.map((org) => {
      return (
        <li key={org.id} className="sidebar-nav-item">
          <a href={`/organizations/${org.id}`}>{org.name}</a>
        </li>
      );
    });

    return (
      <div style={NavStyle}>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" style={customStyle} role="navigation">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="navbar-primary-collapse">
                <ul className="nav navbar-nav">
                  <li className="pull-left" id="slide-sidebar" style={{ marginTop: 10 }}>
                    <a href="#sidebar-nav">
                      {this.props.organization.name} <span className="glyphicon glyphicon-menu-down" aria-hidden="true" />
                    </a>
                  </li>
                  <img id="logo-main" src={logo} alt="Logo Thing main logo" />
                  <li className="pull-right">
                    <Dropdown id="profile-dropdown">
                      <Dropdown.Toggle>
                        <img id="avatar" src={avatar} alt="avatar"></img>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <MenuItem eventKey="1">Profile</MenuItem>
                        <MenuItem eventKey="2">Setting</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="3" onClick={this.logout}>Sign Out</MenuItem>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <div id="sidebar-nav" style={sidebarStyle}>
          <ul id="sidebar-nav-list">
            {organizationNodes}
            <li className="sidebar-nav-item">
              <a href="/organization-new"><span className="icon-plus" /> Create organization</a>
            </li>
          </ul>
        </div>
        <a id="nav-screen-overlay" href="#" />
      </div>
    );
  }
}

OrganizationNavbar.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    organization: state.organization,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationNavbar);
