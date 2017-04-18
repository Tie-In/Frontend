import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import SidebarNav from './SidebarNav';
import 'simple-line-icons/css/simple-line-icons.css';
import logo from '../../images/logo.png';
import './navstyle.css';

class OrganizationNavbar extends Component {
  render() {
    const { user, organization } = this.props;
    const path = `/organizations/${organization.id}`;
    const data = [
      { id: 1, name: 'Setting', path: `${path}/setting` },
    ];
    const wrappedText = {
      width: 150,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    };
    const menuNode = data.map((menu) => {
      return (
        <li key={menu.id} style={{ marginRight: 75 }}>
          <Link to={menu.path} activeClassName="active">{menu.name}</Link>
        </li>
      );
    });

    return (
      <div className="App">
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" style={{ height: 120 }} role="navigation">
            <div className="container-fluid">
              <img id="logo-main" src={logo} alt="Logo" />
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
                  <li className="pull-left" id="slide-sidebar">
                    <a href="#sidebar-nav" className="pull-left" style={wrappedText}>
                      {organization.name} <Glyphicon glyph="menu-down" />
                    </a>
                  </li>
                  {menuNode}
                  <Dropdown className="pull-right" id="profile-dropdown" style={{ width: 75 }}>
                    <Dropdown.Toggle>
                      <img
                        id="avatar" role="presentation"
                        src={user.image}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem disabled>{user.username} ({user.email})</MenuItem>
                      <MenuItem eventKey="1" href={'/profile'}>Profile</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey="2" onClick={this.logout}>Sign Out</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <SidebarNav organizations={user.organizations} />
        <a id="nav-screen-overlay" href="#" />
      </div>
    );
  }
}

OrganizationNavbar.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    organization: state.organization,
  };
}

export default connect(mapStateToProps)(OrganizationNavbar);
