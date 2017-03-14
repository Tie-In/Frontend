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
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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

    this.create = this.create.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async create() {
    this.setState({ createClicked: true });
    let pass = true;
    // check have error
    Object.keys(this.state.input).forEach((key) => {
      const noError = this.validate(key);
      if (!noError) {
        pass = false;
      }
    });
    if (pass && this.state.input.password === this.state.input.password_confirmation) {
      const data = {
        user: this.state.input,
      };
      try {
        const response = await apiHelper.post('/api/users', data);
        const user = response.data;
        this.props.userActions.setUser(user);
        document.location.href = '/';
      } catch (err) {
        const errors = err.response.data.errors;
        const errTemp = this.state.error;
        if (errors.email && errors.email.length > 0) {
          errTemp.email = errors.email[0];
        }
        if (errors.username && errors.username.length > 0) {
          errTemp.username = errors.username[0];
        }
        this.setState({ error: errTemp });
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
    const errorStyle = {
      color: '#d9534f',
      marginLeft: '25px',
    };
    const errorBreak = inputType.replace('_', ' ');
    const errorWord = errorBreak.charAt(0).toUpperCase() + errorBreak.substr(1);
    if (this.state.error[inputType] !== '') {
      return (<h6 style={errorStyle}>{errorWord} {this.state.error[inputType]}</h6>);
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
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };

    return (
      <div style={containerStyle}>
        <h3 className="header-label">Register</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <Col sm={6}>
              <FormGroup
                validationState={this.state.error.firstname === '' ? null : 'error'}
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
                validationState={this.state.error.lastname === '' ? null : 'error'}
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
                validationState={this.state.error.email === '' ? null : 'error'}
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
                validationState={this.state.error.username === '' ? null : 'error'}
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
                validationState={this.state.error.password === '' ? null : 'error'}
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
                validationState={this.state.error.password_confirmation === '' ? null : 'error'}
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
                validationState={this.state.error.birth_date === '' ? null : 'error'}
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
                validationState={this.state.error.phone_number === '' ? null : 'error'}
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
