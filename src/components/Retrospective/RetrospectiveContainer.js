import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Panel, FormGroup, FormControl } from 'react-bootstrap';
import update from 'immutability-helper';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class RetrospectiveContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprints: this.props.project.sprints,
      viewpoints: [],
      select: 0,
    };

    this.startRetro = this.startRetro.bind(this);
    this.handleSelectSprint = this.handleSelectSprint.bind(this);
  }

  async componentWillMount() {
    const { params, user, permissionActions, projectActions } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
      const perLevel = project.project_contributes.find((x) => {
        return x.user_id === user.id;
      }).permission_level;
      permissionActions.setProject(perLevel);
    } catch (err) {
      console.log(err);
    }
    console.log(this.props.project);
  }

  async startRetro() {
    const { organization, project } = this.props;
    const path = `/organizations/${organization.id}/projects/${project.id}`;
    const latestSprint = this.state.sprints[this.state.sprints.length - 1];
    console.log(latestSprint);
    try {
      const res = await apiHelper.post('/api/retrospectives', {
        retrospective: {
          sprint_id: latestSprint.id,
        }
      });
      console.log(res);
    } catch (err) {
      console.log(err.response);
    }
    document.location.href = `${path}/retrospective/new`;
  }

  async handleSelectSprint(e) {
    const sprintSelected = this.state.sprints[Number(e.target.value) - 1];
    try {
      const res = await apiHelper.get(`/api/retrospectives/${sprintSelected.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });
      console.log(this.state.viewpoints);
    } catch (err) {
      console.log(err.response);
    }
  }

  render() {
    const latestSprint = this.state.sprints[this.state.sprints.length - 1];
    const selectSprint = this.state.sprints.map((sprint) => {
      return (
        <option value={sprint.number}>{sprint.number}</option>
      );
    });

    return (
      <div className="tiein-container">
        <Row>
          <h3 className="header-label">Retrospective</h3>
          <hr className="header-line" />
          <Row>
            <Col md={2}>
              <FormGroup id="selectSprint">
                <FormControl
                  componentClass="select"
                  onChange={this.handleSelectSprint}
                >
                  <option value="">Select sprint</option>
                  {selectSprint}
                </FormControl>
              </FormGroup>
            </Col>
            <Col md={4}>
              <p>Latest retrospective: {latestSprint.number - 1}</p>
              <p>Current sprint: {latestSprint.number}</p>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Panel header="Good">
                {this.state.viewpoints.map((data) => {
                  if(data.kind === 'good') {
                    return (
                      <li>{data.comment}</li>
                    );
                  }
                })}
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Bad">
                {this.state.viewpoints.map((data) => {
                  if(data.kind === 'bad') {
                    return (
                      <li>{data.comment}</li>
                    );
                  }
                })}
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Try">
                {this.state.viewpoints.map((data) => {
                  if(data.kind === 'try') {
                    return (
                      <li>{data.comment}</li>
                    );
                  }
                })}
              </Panel>
            </Col>
          </Row>
          <div id="startBtn"><Button onClick={this.startRetro}>Start Retrospective</Button></div>
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

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RetrospectiveContainer);
