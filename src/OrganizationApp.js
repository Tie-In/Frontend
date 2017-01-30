import React, { Component } from 'react';
import {
  OrganizationNavbar,
} from './components';

class OrganizationApp extends Component {
  render() {
    return (
      <div className="App">
        <OrganizationNavbar />
        <div className="container registerContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default OrganizationApp;
