import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import update from 'immutability-helper';
import * as apiHelper from '../../helpers/apiHelper';

class RetrospectiveContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="retroContainer">
        <Row>
          <h4>Retrospective</h4>
          <hr />
        </Row>
      </div>
    );
  }
}

export default RetrospectiveContainer;
