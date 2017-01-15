import React, { PropTypes, Component } from 'react';
import { img } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class RegisterContainer extends Component {
  articleStyles() {
    return {
      position: 'relative',
      margin: '0 auto',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  buttonDefaultStyle() {
    return {
      position: 'absolute',
      backgroundImage: 'none',
      backgroundColor: '#A25E5D',
      color: '#ffffff',
      textShadow: 'none',
      borderColor: '#A25E5D',
      left: '50%',
      transform: 'translate(-50%, 0)',
      marginTop: '8px'
    }
  }

  render() {
    return (
      <div style={this.articleStyles()}>
        <img src={"src/components/Register/addOrg.png"} alt="Image"/>
        <p/>
        <Button style={this.buttonDefaultStyle()}>Create organization</Button>
      </div>
    );
  }
}

export default RegisterContainer;
