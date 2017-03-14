import { Row, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import '../../style/customDatepicker.css';

function validateEmail(email) {
  if (email === '') {
    return true;
  }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

class Profile extends Component {

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
      hasError: false,
      createClicked: false,
      user: {},
    };

    this.update = this.update.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  async update() {
    this.setState({ createClicked: true });
    let pass = true;
    // check have error
    Object.keys(this.state.input).forEach((key) => {
      const noError = this.validate(key);
      if (!noError) {
        pass = false;
      }
    });
    if (pass) {
      try {
        const response = await apiHelper.put(`/api/users/${this.props.user.id}`, {
          user: this.state.input,
        });
        const user = response.data;
        this.props.userActions.setUser(user);
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

  handleChangeDate(date) {
    const temp = this.state.input;
    temp.birth_date = date.format('L');
    this.setState({
      input: temp,
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
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };
    return (
      <div style={containerStyle}>
        <h3 className="header-label">Profile</h3>
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
                  valueLink={linkState(this, 'input.firstname')}
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
                  valueLink={linkState(this, 'input.lastname')}
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
                  valueLink={linkState(this, 'input.email')}
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
                  valueLink={linkState(this, 'input.username')}
                />
                {this.errorLabel('username')}
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
                  valueLink={linkState(this, 'input.phone_number')}
                />
                {this.errorLabel('phone_number')}
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <FormGroup>
              <Col sm={4} smOffset={4}>
                <Button
                  onClick={this.update}
                  disabled={this.checkDisable()}
                  block
                >
                  Save change
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </form>
      </div>
    );
  }
}

Profile.propTypes = {
  userActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
