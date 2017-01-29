import React, { Component } from 'react';
import {
  NormalNavbar,
} from './components';

class App extends Component {
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

export default App;
