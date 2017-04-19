import { Row, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinkContainer } from 'react-router-bootstrap';
import DatePicker from 'react-datepicker';
import update from 'react-addons-update';
import moment from 'moment';
import FormRow from './FormRow';
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
        image: `http://res.cloudinary.com/dyx2tyza6/image/upload/v1492066687/user${Math.ceil(Math.random() * 4)}.png`,
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
      user: {},
    };

    this.register = this.register.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async register() {
    const { input, error } = this.state;
    let noError = true;
    // check have error
    Object.keys(input).forEach((key) => {
      if (!this.validate(key)) {
        noError = false;
      }
    });
    if (noError) {
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
    const { input, error } = this.state;
    const value = input[inputType];
    let pass = false;
    error[inputType] = '';
    if (value === '') {
      error[inputType] = 'is required';
    } else if (inputType === 'email' && !validateEmail(value)) {
      error.email = 'is incorrect format';
    } else if (inputType === 'password_confirmation' && value !== input.password) {
      error.password_confirmation = 'is not match to password';
    } else {
      pass = true;
    }
    this.setState({ error });
    return pass;
  }

  errorLabel(inputType) {
    const { error } = this.state;
    // reformat propert to use in error
    const errorBreak = inputType.replace('_', ' ');
    const errorWord = errorBreak.charAt(0).toUpperCase() + errorBreak.substr(1);
    if (error[inputType] !== '') {
      return (`${errorWord} ${error[inputType]}`);
    }
    return '';
  }

  handleInputChange(type, text) {
    this.setState({
      input: update(this.state.input, {
        [type]: { $set: text },
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
    const { input, error } = this.state;
    return (
      <div className="tiein-container">
        <h3 className="header-label">Register</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <FormRow
              title="Firstname" name="firstname"
              value={input.firstname}
              handleInput={this.handleInputChange} error={this.errorLabel('firstname')}
            />
            <FormRow
              title="Lastname" name="lastname"
              value={input.lastname}
              handleInput={this.handleInputChange} error={this.errorLabel('lastname')}
            />
          </Row>
          <Row>
            <FormRow
              title="Email" name="email"
              value={input.email}
              handleInput={this.handleInputChange} error={this.errorLabel('email')}
            />
            <FormRow
              title="Username" name="username"
              value={input.username}
              handleInput={this.handleInputChange} error={this.errorLabel('username')}
            />
          </Row>
          <Row>
            <FormRow
              title="Password" name="password"
              value={input.password}
              handleInput={this.handleInputChange} error={this.errorLabel('password')}
              type="password"
            />
            <FormRow
              title="Confirm password" name="password_confirmation"
              value={input.password_confirmation}
              handleInput={this.handleInputChange} error={this.errorLabel('password_confirmation')}
              type="password"
            />
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
                <h6 className="error-label">{this.errorLabel('birth_date')}</h6>
              </FormGroup>
            </Col>
            <FormRow
              title="Phone number" name="phone_number"
              value={input.phone_number}
              handleInput={this.handleInputChange} error={this.errorLabel('phone_number')}
            />
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
