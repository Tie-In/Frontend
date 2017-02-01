import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  NormalNavbar,
} from './components';

class App extends Component {
  componentWillMount() {
    if (this.props.user.auth_token === undefined) {
      document.location.href = '/login';
    }
  }

  render() {
    return (
      <div className="App">
        <NormalNavbar />
        <div className="container mainContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
