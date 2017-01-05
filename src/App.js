import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button bsStyle="primary">test</Button>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
