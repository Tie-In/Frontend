import React, { PropTypes, Component } from 'react';

class SidebarNav extends Component {

  render() {
    const organizationNodes = this.props.organizations.map((org) => {
      return (
        <li key={org.id} className="sidebar-nav-item">
          <a href={`/organizations/${org.id}`}>{org.name}</a>
        </li>
      );
    });

    return (
      <div id="sidebar-nav" style={this.props.style}>
        <ul id="sidebar-nav-list">
          {organizationNodes}
          <li className="sidebar-nav-item">
            <a href="/organizations/new"><span className="icon-plus" /> Create organization</a>
          </li>
        </ul>
      </div>
    );
  }
}

SidebarNav.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
};

export default SidebarNav;
