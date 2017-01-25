import { Image, Button } from 'react-bootstrap';
import React, { Component } from 'react';

class NoOrgContainer extends Component {
  render() {
    const articleStyles = {
      position: 'relative',
      margin: '0 auto',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    const buttonDefaultStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
      marginTop: '8px',
    };
    return (
      <div style={articleStyles}>
        <Image src={'src/components/Organization/addOrg.png'} alt="Image" />
        <p />
        <Button href="/new-organization" style={buttonDefaultStyle}>Create new organization</Button>
      </div>
    );
  }
}

export default NoOrgContainer;
