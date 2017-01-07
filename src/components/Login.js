import { Form, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import BackgroundImage from 'react-background-image-loader';
import logo from '../images/logo.png';
import Background from '../images/BG-white.png';

class Login extends Component {

  componentWillMount() {
    document.body.style.backgroundImage = `url(${Background})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }

  render() {
    const logoMargin = {
      marginBottom: 50,
    }

    const loginBlogStyle = {
      width: '25%',
      height: 'auto',
      right: '50%',
      bottom: '50%',
      transform: 'translate(50%,50%)',
      position: 'absolute',
    };

    const logoStyle = {
      width: '40%',
      height: 'auto',
      display: 'block',
      margin: 'auto',
    };

    const inputStyle = {
      background: 'transparent',
      borderColor: 'black',
    };

    const registerButton = {
      background: 'transparent',
      borderColor: 'black',
    };

    const signinButton = {
      background: '#A25E5D',
      color: 'white',
    };

    return (
      <div>
        <div style={loginBlogStyle}>
          <div style={logoMargin}>
            <img style={logoStyle} src={logo} alt="logo" />
          </div>
          <form>
            <FormGroup>
              <ControlLabel>Username or Email</ControlLabel>
              <FormControl
                id="formControlsText"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                id="formControlsText"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Col sm={6}>
                <Button style={registerButton} type="submit" block>
                  Register
                </Button>
              </Col>
              <Col sm={6}>
                <Button style={signinButton} type="submit" block>
                  Sign in
                </Button>
              </Col>
            </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;
