import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import SidebarNav from './SidebarNav';
import 'simple-line-icons/css/simple-line-icons.css';
import logo from '../../images/logo.png';
import './navstyle.css';

class OrganizationNavbar extends Component {
  logout() {
    localStorage.clear();
    document.location.href = '/login';
  }

  render() {
    const { user, organization } = this.props;
    const sidebarStyle = {
      top: '70px',
    };

    return (
      <div>
        <header role="banner">
          <nav id="navbar-primary" className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
              <div className="navbar-header" style={{ marginTop: 10 }}>
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-primary-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
              </div>
              <div className="collapse navbar-collapse" id="navbar-primary-collapse">
                <ul className="nav navbar-nav">
                  <li className="pull-left" id="slide-sidebar" style={{ marginTop: 10, width: '20%', textAlign: 'left' }}>
                    <a href="#sidebar-nav">
                      {organization.name} <span className="glyphicon glyphicon-menu-down" aria-hidden="true" />
                    </a>
                  </li>
                  <Dropdown className="pull-right" id="profile-dropdown" style={{ width: '20%' }}>
                    <Dropdown.Toggle>
                      <img
                        id="avatar" role="presentation"
                        src={`../../src/images/${user.image}.png`}
                        style={{marginTop: 10, marginLeft: '450%'}}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey="1" href={`/profile`}>Profile</MenuItem>
                      <MenuItem eventKey="2" href={`/organizations/${organization.id}/setting`}>Setting</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey="3" onClick={this.logout}>Sign Out</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                  <img id="logo-main" src={logo} alt="Logo" />
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <SidebarNav style={sidebarStyle} organizations={user.organizations} />
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
