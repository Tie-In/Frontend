import { Row, FormGroup, Col, Button, FormControl, ControlLabel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinkContainer } from 'react-router-bootstrap';
import linkState from 'react-link-state';
import DatePicker from 'react-datepicker';
import update from 'react-addons-update';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import '../../style/customDatepicker.css';

function validateEmail(email) {
  if (email === '') {
    return true;
  }
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
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
      user: {},
    };

    this.update = this.update.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  async update() {
    const { input } = this.state;
    let noError = true;
    // check have error
    Object.keys(input).forEach((key) => {
      if (!this.validate(key)) {
        noError = false;
      }
    });

    if (noError) {
      try {
        const response = await apiHelper.put(`/api/users/${this.props.user.id}`, {
          user: input,
        });
        const user = response.data;
        this.props.userActions.setUser(user);
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
    this.setState({ error: error });
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
    this.setState({
      input: update(this.state.input, {
        birth_date: {$set: date.format('L')},
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

  onDrop(files) {
    console.log(files);
    this.setState({
      files: files
    });
  }

  render() {
    const { input, error } = this.state;
    const dropzoneStyle = {
      width: 200,
      height: 200,
      border: 'solid 2px',
      cursor: 'pointer',
    };
    const picBG = {
      textAlign: 'center', 
      position: 'absolute', 
      bottom: '1px',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      width: 200,
      height: 31,
      lineHeight: '31px',
    };
    return (
      <div className="tiein-container">
        <h3 className="header-label">Profile</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <Col xs={12} sm={6}>
              {this.state.files ? 
                <Dropzone style={dropzoneStyle} onDrop={this.onDrop}>
                  <div>
                    <div>{this.state.files.map((file) => <img style={dropzoneStyle} src={file.preview} />)}</div>
                    <div style={picBG}>Upload Picture</div>
                  </div>
                </Dropzone>: 
                <Dropzone style={dropzoneStyle} onDrop={this.onDrop}>
                  <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
              }
            </Col>
            <Col xs={12} sm={6}>
              <Row>
                <FormGroup
                  validationState={error.firstname === '' ? null : 'error'}
                >
                  <ControlLabel>Firstname</ControlLabel>
                  <FormControl
                    placeholder="Firstname"
                    name="firstname"
                    value={input.firstname}
                    onChange={this.handleInputChange}
                  />
                  {this.errorLabel('firstname')}
                </FormGroup>
              </Row>
              <Row>
                <FormGroup
                  validationState={error.lastname === '' ? null : 'error'}
                >
                  <ControlLabel>Lastname</ControlLabel>
                  <FormControl
                    placeholder="Lastname"
                    name="lastname"
                    value={input.lastname}
                    onChange={this.handleInputChange}
                  />
                  {this.errorLabel('lastname')}
                </FormGroup>
              </Row>
              <Row>
                <FormGroup
                  validationState={error.email === '' ? null : 'error'}
                >
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl
                    placeholder="Email"
                    name="email"
                    value={input.email}
                    onChange={this.handleInputChange}
                  />
                  {this.errorLabel('email')}
                </FormGroup>
              </Row>
              <Row>
                <FormGroup
                  validationState={error.username === '' ? null : 'error'}
                >
                  <ControlLabel>Username</ControlLabel>
                  <FormControl
                    placeholder="Username"
                    name="username"
                    value={input.username}
                    onChange={this.handleInputChange}
                  />
                  {this.errorLabel('username')}
                </FormGroup>
              </Row>
              <Row>
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
              </Row>
              <Row>
                <FormGroup
                  validationState={error.phone_number === '' ? null : 'error'}
                >
                  <ControlLabel>Phone number</ControlLabel>
                  <FormControl
                    placeholder="Phone number"
                    name="phone_number"
                    value={input.phone_number}
                    onChange={this.handleInputChange}
                  />
                  {this.errorLabel('phone_number')}
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <Col xs={12} sm={4} smOffset={4}>
                    <Button
                      onClick={this.update}
                      disabled={this.checkDisable()}
                      block
                    >
                      Update
                    </Button>
                  </Col>
                </FormGroup>
              </Row>
            </Col>
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
