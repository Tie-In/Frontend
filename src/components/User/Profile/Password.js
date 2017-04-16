import React, { PropTypes, Component } from 'react';
import {
  Row, FormGroup, Col, Button,
  FormControl, ControlLabel,
} from 'react-bootstrap';
import update from 'react-addons-update';

class Password extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      },
      error: '',
    };

    this.update = this.update.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkDisable = this.checkDisable.bind(this);
  }

  async update() {
    const { input } = this.state;
    if (input.confirm_new_password !== input.new_password) {
      this.setState({ error: 'Confirm new password is not match' });
    } else {
      const msg = await this.props.update(input);
      if (msg !== 'done') {
        this.setState({ error: msg });
      } else {
        this.setState({
          input: {
            current_password: '',
            new_password: '',
            confirm_new_password: '',
          },
          error: '',
        });
      }
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

  checkDisable() {
    let filled = false;
    const propsName = Object.getOwnPropertyNames(this.state.input);
    propsName.forEach((name) => {
      filled = this.state.input[name] !== '';
    });
    return !filled;
  }

  render() {
    const { input, error } = this.state;
    return (
      <div>
        <Row>
          <Col xs={12} sm={6}>
            <FormGroup>
              <ControlLabel>Current password</ControlLabel>
              <FormControl
                type="password"
                placeholder="Current password"
                name="current_password"
                value={input.current_password}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6}>
            { error !== '' ?
              <h4 style={{ marginTop: 30, color: '#d9534f', marginLeft: '25px' }}>{error}</h4>
              : <div />
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <FormGroup>
              <ControlLabel>New Password</ControlLabel>
              <FormControl
                type="password"
                placeholder="New password"
                name="new_password"
                value={input.new_password}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6}>
            <FormGroup>
              <ControlLabel>Confirm new password</ControlLabel>
              <FormControl
                type="password"
                placeholder="Confirm new password"
                name="confirm_new_password"
                value={input.confirm_new_password}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
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
              Update Password
              </Button>
            </Col>
          </FormGroup>
        </Row>
      </div>
    );
  }
}

Password.propTypes = {
  update: PropTypes.func.isRequired,
};

export default Password;
