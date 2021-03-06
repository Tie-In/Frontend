import React, { PropTypes, Component } from 'react';
import {
  Row, FormGroup, Col, Button,
  ControlLabel,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import update from 'react-addons-update';
import FormRow from '../FormRow';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../style/customDatepicker.css';

function validateEmail(email) {
  if (email === '') {
    return true;
  }
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

class UserProfile extends Component {

  constructor(props) {
    super(props);

    const { user } = this.props;
    const bd = moment(user.birth_date);

    this.state = {
      input: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        birth_date: bd.format('L'),
        phone_number: user.phone_number,
      },
      error: {
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        birth_date: '',
        phone_number: '',
      },
      selectedDate: bd,
      user: {},
    };

    this.update = this.update.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async update() {
    const { input, error } = this.state;
    let noError = true;
    // check have error
    Object.keys(input).forEach((key) => {
      if (!this.validate(key)) {
        noError = false;
      }
    });

    if (noError) {
      const errors = this.props.update(input);
      if (errors !== null) {
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
    this.setState({
      input: update(this.state.input, {
        birth_date: { $set: date.format('L') },
      }),
      selectedDate: date,
    });
  }

  checkDisable() {
    let same = true;
    const propsName = Object.getOwnPropertyNames(this.state.input);
    propsName.forEach((name) => {
      if (this.state.input[name] !== this.props.user[name]) {
        if (name === 'birth_date') {
          const bd = moment(this.props.user.birth_date).format('L');
          if (bd !== this.state.input.birth_date) {
            same = false;
          }
        } else {
          same = false;
        }
      }
    });
    return same;
  }

  render() {
    const { input, error } = this.state;
    return (
      <div>
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
          <Col xs={12} sm={6}>
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
          <FormRow
            title="Phone number" name="phone_number"
            value={input.phone_number}
            handleInput={this.handleInputChange} error={this.errorLabel('phone_number')}
          />
        </Row>
        <br />
        <Row>
          <FormGroup>
            <Col xs={12} sm={4} smOffset={4}>
              <Button
                onClick={() => { this.update(); }}
                disabled={this.checkDisable()}
                block
              >
              Update
              </Button>
            </Col>
          </FormGroup>
        </Row>
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default UserProfile;
