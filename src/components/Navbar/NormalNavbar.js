import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import SidebarNav from './SidebarNav';
import DropdownUser from './DropdownUser';
import 'simple-line-icons/css/simple-line-icons.css';
import './navstyle.css';
import logo from '../../images/logo.png';

class NormalNavbar extends Component {
  render() {
    const { user, organization, project } = this.props;
    const path = `/organizations/${organization.id}/projects/${project.id}`;
    const data = [
      { id: 1, name: 'Detail', path: `${path}` },
      { id: 2, name: 'Estimation', path: `${path}/planning` },
      { id: 3, name: 'New task', path: `${path}/tasks/new` },
      { id: 4, name: 'Backlog', path: `${path}/backlog` },
      { id: 5, name: 'Active sprint', path: `${path}/board` },
      { id: 6, name: 'Retrospective', path: `${path}/retrospective` },
      { id: 7, name: 'Dashboard', path: `${path}/dashboard` },
      { id: 8, name: 'Setting', path: `${path}/setting` },
    ];
    const wrappedText = {
      width: 150,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    };
    const menuNode = data.map((menu) => {
      if (project.current_sprint_id === null && menu.name === 'Active sprint') {
        return null;
      }
      let selected = new RegExp(menu.path).test(window.location.href);
      if (menu.name === 'Detail') {
        selected = window.location.href.endsWith(menu.path);
      }
      return (
        <li key={menu.id}>
          <Link to={menu.path} className={selected ? 'active' : null} onClick={() => { this.setState({}); }}>
            {menu.name}
          </Link>
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
                  <li className="pull-left" id="slide-sidebar" style={{ width: 150 }}>
                    <a href="#sidebar-nav" style={wrappedText}>
                      {organization.name} <Glyphicon glyph="menu-down" />
                    </a>
                  </li>
                  {menuNode}
                  <DropdownUser user={user} />
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
