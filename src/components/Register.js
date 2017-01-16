import { Row, FormGroup, Col, Button, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import * as userActions from '../actions/user-actions';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        username: '',
        password_confirmation: '',
        birth_date: '',
        phone_number: '',
      },
      error: {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        username: '',
        password_confirmation: '',
        birth_date: '',
        phone_number: '',
      },
      isError: false,
      createClicked: false,
      user: {},
    };

    this.create = this.create.bind(this);
    this.validate = this.validate.bind(this);
  }

  create() {
    let pass = true;
    this.setState({ createClicked: true });
    Object.keys(this.state.error).forEach((key) => {
      const value = this.state.error[key];
      if (value !== '') {
        pass = false;
        this.setState({ isError: true });
      }
    });
    if (pass && this.state.input.password === this.state.input.password_confirmation) {
      axios.post('/api/users', {
        user: this.state.input,
      }).then((response) => {
        this.props.actions.setUser(response.data);
        // go next
      }).catch((error) => {
        console.log(error.response.data);
        const err = error.response.data.errors;
        const errState = this.state.error;
        if (err.email.length > 0) {
          errState.email = err.email[0];
        }
      });
    }
  }

  validateEmail(email) {
    if (email === '') {
      return true;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validate(inputType) {
    const input = this.state.input;
    const err = this.state.error;
    const value = input[inputType];
    if (this.state.createClicked) {
      if (value === '') {
        err[inputType] = 'is required';
        return false;
      } else if (inputType === 'email' && !this.validateEmail(value)) {
        err[inputType] = 'is incorrect format';
        return false;
      } else if (inputType === 'password_confirmation' && value !== input.password) {
        err[inputType] = 'is not match to password';
        return false;
      }
      err[inputType] = '';
    }
    return true;
  }
  errorLabel(inputType) {
    const errorStyle = {
      color: '#d9534f',
      marginLeft: '25px',
    };
    if (this.state.error[inputType] !== '') {
      return (<h6 style={errorStyle}>{inputType} {this.state.error[inputType]}</h6>);
    }
    return null;
  }

  render() {
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };
    const headerStyle = {
      color: '#A25E5D',
    };
    const cancelButton = {
      background: 'transparent',
      borderColor: '#A25E5D',
      color: '#A25E5D',
    };
    const lineColor = {
      borderColor: 'black',
    };
    return (
      <div style={containerStyle}>
        <h3 style={headerStyle}>Register</h3>
        <hr style={lineColor} />
        <form>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('firstname') ? null : 'error'}
              >
                <ControlLabel>Firstname</ControlLabel>
                <FormControl
                  placeholder="Firstname"
                  valueLink={linkState(this, 'input.firstname')}
                />
                {this.errorLabel('firstname')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('lastname') ? null : 'error'}
              >
                <ControlLabel>Lastname</ControlLabel>
                <FormControl
                  placeholder="Lastname"
                  valueLink={linkState(this, 'input.lastname')}
                />
                {this.errorLabel('lastname')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('email') ? null : 'error'}
              >
                <ControlLabel>Email address</ControlLabel>
                <FormControl
                  placeholder="Email"
                  valueLink={linkState(this, 'input.email')}
                />
              </FormGroup>
              {this.errorLabel('email')}
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('username') ? null : 'error'}
              >
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  placeholder="Username"
                  valueLink={linkState(this, 'input.username')}
                />
                {this.errorLabel('username')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('password') ? null : 'error'}
              >
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  placeholder="Password"
                  valueLink={linkState(this, 'input.password')}
                />
                {this.errorLabel('password')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('password_confirmation') ? null : 'error'}
              >
                <ControlLabel>Confirm password</ControlLabel>
                <FormControl
                  type="password"
                  placeholder="Confirm password"
                  valueLink={linkState(this, 'input.password_confirmation')}
                />
                {this.errorLabel('password_confirmation')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('birth_date') ? null : 'error'}
              >
                <ControlLabel>Date of Birth</ControlLabel>
                <FormControl
                  placeholder="MM/DD/YYYY"
                  valueLink={linkState(this, 'input.birth_date')}
                />
                {this.errorLabel('birth_date')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={this.validate('phone_number') ? null : 'error'}
              >
                <ControlLabel>Phone number</ControlLabel>
                <FormControl
                  placeholder="Phone number"
                  valueLink={linkState(this, 'input.phone_number')}
                />
                {this.errorLabel('phone_number')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup>
              <Col sm={10}>
                <Checkbox>
                  Accept <a>term and condition</a>
                </Checkbox>
              </Col>
            </FormGroup>
          </Row>
          <br />
          <Row>
            <FormGroup>
              <Col smOffset={2} sm={4}>
                <Button
                  style={cancelButton}
                  block
                >
                  Cancel
                </Button>
              </Col>
              <Col sm={4}>
                <Button
                  bsStyle="primary"
                  onClick={this.create}
                  block
                >
                  Create
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
