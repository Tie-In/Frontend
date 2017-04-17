import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Button,
  FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';
import update from 'react-addons-update';

class Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {
        name: props.project.name,
        description: props.project.description,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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
    let same = true;
    const propsName = Object.getOwnPropertyNames(this.state.input);
    propsName.forEach((name) => {
      if (this.state.input[name] !== this.props.project[name]) {
        same = false;
      }
    });
    return same;
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>
                Project's name
              </ControlLabel>
              <FormControl
                type="text" placeholder="Name"
                name="name"
                value={this.state.input.name}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="formInlineDetail">
              <ControlLabel>
                Description (optional)
              </ControlLabel>
              <FormControl
                type="text" placeholder="Description of project"
                name="description"
                value={this.state.input.description}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <FormGroup>
            <Col sm={4} smOffset={4}>
              <Button
                onClick={() => { this.props.update(this.state.input); }}
                disabled={this.checkDisable()}
                block
              >
                Save change
              </Button>
            </Col>
          </FormGroup>
        </Row>
      </div>
    );
  }
}

Information.propTypes = {
  project: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default Information;
