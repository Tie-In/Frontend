import React, { PropTypes, Component } from 'react';
import NavStyle from '../../style/navstyle.css';
import logo from '../../images/logo.png';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'simple-line-icons/css/simple-line-icons.css';
import * as userActions from '../../actions/user-actions';

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
    console.log(this.props.user);
    const menuNode = this.state.menus.map((menu) => {
      return (
        <li key={menu.id}>
          <Link to={menu.path} activeClassName="active"> {menu.name}</Link>
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
                  <li className="pull-left" id="slide-sidebar">
                    <a href="#sidebar-nav">
                      {this.props.organization.name} <span className="glyphicon glyphicon-menu-down" aria-hidden="true" />
                    </a>
                  </li>
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
        <div id="sidebar-nav">
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

NormalNavbar.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NormalNavbar);
