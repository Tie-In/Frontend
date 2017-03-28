import { FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'react-addons-update';
import logo from '../../images/logo-login.png';
import Background from '../../images/BG-white.png';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './login.css';

const findPath = (user) => {
  const firstOrg = user.organizations[0];
  if (firstOrg) {
    document.location.href = '/organizations/' + firstOrg.id;
  } else {
    document.location.href = '/';
  }
};

const preventSubmit = (e) => {
  e.preventDefault();
};

const register = () => {
  document.location.href = '/register';
};

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        email: '',
        password: '',
      },
      user: {},
      error: '',
    };

    this.login = this.login.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    if (this.props.user.auth_token !== undefined) {
      findPath(this.props.user);
    }
    // set background style
    document.body.style.backgroundImage = `url(${Background})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }

  async login() {
    try {
      const response = await apiHelper.post('/api/sessions', {
        session: this.state.input,
      });
      const user = response.data;
      this.props.userActions.setUser(user);
      findPath(user);
    } catch (err) {
      const errors = err.response.data.errors;
      this.setState({ error: errors });
    }
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      input: update(this.state.input, {
        [name]: { $set: value },
      }),
    });
  }

  render() {
    const { error } = this.state;

    // first priority css
    const registerButton = {
      background: 'transparent',
      borderColor: 'black',
      color: 'black',
    };
    
    const errorLabel = {
      color: '#d9534f',
    };

    return (
      <div className="login-container" >
        <div style={{marginBottom: 50}}>
          <img className="logo" src={logo} alt="logo" />
        </div>
        <form onSubmit={preventSubmit}>
          <FormGroup>
            <ControlLabel>Username or Email</ControlLabel>
            <FormControl
              className="login-input"
              name="email"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              className="login-input"
              name="password"
              type="password"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <p style={errorLabel}>{error}</p>
          <FormGroup>
            <Col sm={6}>
              <Button style={registerButton} onClick={register} block>Register</Button>
            </Col>
            <Col sm={6}>
              <Button onClick={this.login} type="submit" block>
                Sign in
              </Button>
            </Col>
          </FormGroup>
        </form>
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
