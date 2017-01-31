import { Form, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import axios from 'axios';
import BackgroundImage from 'react-background-image-loader';
import logo from '../images/logo-login.png';
import Background from '../images/BG-white.png';
import * as userActions from '../actions/user-actions';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      user: {},
      error: '',
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  componentWillMount() {
    // set background style
    document.body.style.backgroundImage = `url(${Background})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }

  login() {
    let user = {};
    axios.post('/api/sessions', {
      session: {
        email: this.state.email,
        password: this.state.password,
      },
    }).then((response) => {
      user = response.data;
      this.props.userActions.setUser(user);
      const firstOrg = user.organizations[0];
      if (firstOrg) {
        document.location.href = '/organizations/' + firstOrg.id;
      } else {
        document.location.href = '/';
      }
    }).catch((response) => {
      console.log(response.response.data.errors);
      const errors = response.response.data.errors;
      this.setState({ error: errors });
    });
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  doSomething(e) {
    e.preventDefault();
  }

  register() {
    document.location.href = '/register';
  }
  render() {
    const logoMargin = {
      marginBottom: 50,
    };
    const loginBlogStyle = {
      width: '25%',
      height: 'auto',
      right: '50%',
      bottom: '60%',
      transform: 'translate(50%,50%)',
      position: 'absolute',
    };

    const logoStyle = {
      width: '35%',
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
      color: 'black',
    };

    return (
      <div>
        <div style={loginBlogStyle}>
          <div style={logoMargin}>
            <img style={logoStyle} src={logo} alt="logo" />
          </div>
          <form onSubmit={this.doSomething}>
            <FormGroup>
              <ControlLabel>Username or Email</ControlLabel>
              <FormControl
                style={inputStyle}
                onChange={this.handleEmail}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                style={inputStyle}
                onChange={this.handlePassword}
                type="password"
              />
            </FormGroup>
            <p style={{color: 'red'}}>{this.state.error}</p>
            <FormGroup>
              <Col sm={6}>
                <Button
                  style={registerButton}
                  onClick={this.register}
                  block
                >
                  Register
                </Button>
              </Col>
              <Col sm={6}>
                <Button
                  onClick={this.login}
                  type="submit"
                  block
                >
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

Login.propTypes = {
  user: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
