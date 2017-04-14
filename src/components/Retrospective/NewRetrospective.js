import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, DropdownButton,
  MenuItem, Panel, FormGroup,
  ControlLabel, FormControl } from 'react-bootstrap';
import update from 'immutability-helper';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class NewRetrospective extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="newRetro">
        <Row>
          <h4>Create new retrospective</h4>
          <hr />
        </Row>
      </div>
    );
  }
}

export default NewRetrospective;
