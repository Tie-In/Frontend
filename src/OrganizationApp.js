import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  OrganizationNavbar,
} from './components';

class OrganizationApp extends Component {

  componentWillMount() {
    if (this.props.user.auth_token === undefined) {
      document.location.href = '/login';
    }
  }

  render() {
    return (
      <div className="App">
        <OrganizationNavbar />
        <div className="container mainContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

OrganizationApp.propTypes = {
  user: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(OrganizationApp);
