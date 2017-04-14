import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, DropdownButton,
  MenuItem, Panel, FormGroup,
  ControlLabel, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class RetrospectiveContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { organization, project } = this.props;
    const path = `/organizations/${organization.id}/projects/${project.id}`;
    return (
      <div className="retroContainer">
        <Row>
          <h3 className="header-label">Retrospective</h3>
          <hr className="header-line" />
          <Row>
            <Col md={2}>
              <FormGroup id="selectSprint">
                <FormControl
                  componentClass="select" placeholder="Sprint"
                >
                  <option value="">Select sprint</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={2}>
              <p>Latest retrospective:</p>
              <p>Current sprint:</p>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Panel header="Good">
                <li>ABC</li>
                <li>ABCsfa</li>
                <li>ABCfewg</li>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Bad">
                eieieiei
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Try">
                sdgksd;lkm
              </Panel>
            </Col>
          </Row>

          <div id="startBtn"><Button href={`${path}/retrospective/new`} >Start Retrospective</Button></div>
        </Row>
      </div>
    );
  }
}

RetrospectiveContainer.propTypes = {
  organization: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    project: state.project,
  };
}

export default connect(mapStateToProps)(RetrospectiveContainer);
