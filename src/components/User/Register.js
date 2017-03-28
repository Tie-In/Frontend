import { Row, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinkContainer } from 'react-router-bootstrap';
import DatePicker from 'react-datepicker';
import update from 'react-addons-update';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../style/customDatepicker.css';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';

const validateEmail = (email) => {
  if (email === '') {
    return true;
  }
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
};

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
        image: 'user'.concat(Math.ceil(Math.random() * 4)),
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
      selectedDate: '',
      hasError: false,
      createClicked: false,
      user: {},
    };

    this.register = this.register.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async register() {
    const { input, error } = this.state;

    this.setState({ createClicked: true });
    let noError = true;
    // check have error
    Object.keys(input).forEach((key) => {
      if (!this.validate(key)) {
        noError = false;
      }
    });
    
    if (noError) {
      console.log('send');
      try {
        const response = await apiHelper.post('/api/users', {
          user: input,
        });
        const user = response.data;
        this.props.userActions.setUser(user);
        document.location.href = '/';
      } catch (err) {
        const errors = err.response.data.errors;
        const errorTemp = error;
        if (errors.email && errors.email.length > 0) {
          errorTemp.email = errors.email[0];
        }
        if (errors.username && errors.username.length > 0) {
          errorTemp.username = errors.username[0];
        }
        this.setState({ error: errorTemp });
      }
    }
  }

  validate(inputType) {
    const input = this.state.input;
    const err = this.state.error;
    const value = input[inputType];

    let pass = false;
    err[inputType] = '';
    if (value === '') {
      err[inputType] = 'is required';
    } else if (inputType === 'email' && !validateEmail(value)) {
      err.email = 'is incorrect format';
    } else if (inputType === 'password_confirmation' && value !== input.password) {
      err.password_confirmation = 'is not match to password';
    } else {
      pass = true;
    }
    this.setState({ error: err });
    return pass;
  }

  errorLabel(inputType) {
    const { error } = this.state;
    // modified this with global
    const errorStyle = {
      color: '#d9534f',
      marginLeft: '25px',
    };
    // reformat propert to use in error
    const errorBreak = inputType.replace('_', ' ');
    const errorWord = errorBreak.charAt(0).toUpperCase() + errorBreak.substr(1);
    if (error[inputType] !== '') {
      return (<h6 style={errorStyle}>{errorWord} {error[inputType]}</h6>);
    }
    return null;
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

  handleChangeDate(date) {
    const temp = this.state.input;
    temp.birth_date = date.format('L');
    this.setState({
      input: temp,
      selectedDate: date,
    });
  }


  render() {
    const { error } = this.state;
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };

    return (
      <div className="tiein-container">
        <h3 className="header-label">Register</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={error.firstname === '' ? null : 'error'}
              >
                <ControlLabel>Firstname</ControlLabel>
                <FormControl
                  placeholder="Firstname"
                  name="firstname"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('firstname')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={error.lastname === '' ? null : 'error'}
              >
                <ControlLabel>Lastname</ControlLabel>
                <FormControl
                  placeholder="Lastname"
                  name="lastname"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('lastname')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={error.email === '' ? null : 'error'}
              >
                <ControlLabel>Email address</ControlLabel>
                <FormControl
                  placeholder="Email"
                  name="email"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              {this.errorLabel('email')}
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={error.username === '' ? null : 'error'}
              >
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  placeholder="Username"
                  name="username"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('username')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={error.password === '' ? null : 'error'}
              >
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('password')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={error.password_confirmation === '' ? null : 'error'}
              >
                <ControlLabel>Confirm password</ControlLabel>
                <FormControl
                  type="password"
                  name="password_confirmation"
                  placeholder="Password confirmation"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('password_confirmation')}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={error.birth_date === '' ? null : 'error'}
              >
                <ControlLabel>Date of Birth</ControlLabel>
                <DatePicker
                  selected={this.state.selectedDate}
                  onChange={this.handleChangeDate}
                  placeholderText="MM/DD/YYYY"
                  maxDate={moment()}
                  className="form-control"
                  peekNextMonth showMonthDropdown showYearDropdown
                  dropdownMode="select"
                />
                {this.errorLabel('birth_date')}
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                validationState={error.phone_number === '' ? null : 'error'}
              >
                <ControlLabel>Phone number</ControlLabel>
                <FormControl
                  placeholder="Phone number"
                  name="phone_number"
                  onChange={this.handleInputChange}
                />
                {this.errorLabel('phone_number')}
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <FormGroup>
              <Col smOffset={2} sm={4}>
                <LinkContainer to={{ pathname: 'login' }}>
                  <Button bsStyle="primary" block>
                    Cancel
                  </Button>
                </LinkContainer>
              </Col>
              <Col sm={4}>
                <Button
                  onClick={this.register}
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
