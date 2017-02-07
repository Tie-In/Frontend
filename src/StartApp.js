import React, { Component } from 'react';
import {
  StartNavbar,
} from './components';

class StartApp extends Component {
  render() {
    return (
      <div className="App">
        <StartNavbar />
        <div className="container registerContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default StartApp;
