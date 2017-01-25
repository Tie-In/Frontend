import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button href="/no-organization">no bsStyle (default)</Button>
        <Button bsStyle="primary">bsStyle="primary"</Button>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
