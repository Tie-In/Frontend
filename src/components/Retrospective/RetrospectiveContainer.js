import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Panel, FormGroup, FormControl } from 'react-bootstrap';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class RetrospectiveContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprints: this.props.project.sprints,
      permission: this.props.permission.project,
      project: this.props.project,
      organization: this.props.organization,
      viewpoints: [],
      selectedIndex: this.props.project.sprints.length - 1,
      selectedSprint: this.props.project.sprints[this.props.project.sprints.length - 1],
    };

    this.startRetro = this.startRetro.bind(this);
    this.handleSelectSprint = this.handleSelectSprint.bind(this);
  }

  async componentWillMount() {
    const { params, user, permissionActions, projectActions } = this.props;
    try {
      const res = await apiHelper.get(`/api/retrospectives/${this.state.selectedSprint.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });

      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);

      console.log(this.state.viewpoints);
    } catch (err) {
      console.log(err);
    }
  }

  async startRetro() {
    const path = `/organizations/${this.state.organization.id}/projects/${this.state.project.id}`;
    try {
      const res = await apiHelper.post('/api/retrospectives', {
        retrospective: {
          sprint_id: this.state.selectedSprint.id,
        }
      });
      console.log(res);
    } catch (err) {
      console.log(err.response);
    }
    document.location.href = `${path}/retrospective/new`;
  }

  async handleSelectSprint(e) {
    const tempIndex = e.target.value - 1;
    const tempSprint = this.state.sprints[tempIndex];

    try {
      const res = await apiHelper.get(`/api/retrospectives/${tempSprint.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });
      console.log(this.state.viewpoints);
    } catch (err) {
      this.setState({ viewpoints: err.response });
      console.log(err.response);
    }
    this.setState({
      selectedIndex: tempIndex,
      selectedSprint: tempSprint,
    });
  }

  render() {
    const latestSprint = this.state.sprints[this.state.sprints.length - 1];
    const selectSprint = this.state.sprints.map((sprint) => {
      if(sprint.number === this.state.sprints.length) {
        return (
          <option value={sprint.number} selected>{sprint.number}</option>
        );
      }
      return (
        <option value={sprint.number}>{sprint.number}</option>
      );
    });

    const startBtn = () => {
      const path = `/organizations/${this.state.organization.id}/projects/${this.state.project.id}`;
      if(this.state.permission === 'admin') {
        if(!this.state.selectedSprint.is_ended) {
            return (<Button className="disabled">Start Retrospective</Button>);
        }
        else if(!this.state.viewpoints) {
          return (<Button onClick={this.startRetro}>Start Retrospective</Button>);
        }
        else if (this.state.selectedSprint === latestSprint) {
          return (<Button href={`${path}/retrospective/management`}>Manage</Button>);
        }
      }
      if(!this.state.viewpoints && this.state.selectedSprint.is_ended) {
        return (<Button href={`${path}/retrospective/new`}>Join</Button>);
      }
    };

    const comments = (kind) => {
      if(this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          if(this.state.viewpoints && data.kind === kind) {
            return (<li>{data.comment}</li>);
          }
        });
      }
    }

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
                {comments('good')}
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Bad">
                {comments('bad')}
              </Panel>
            </Col>
            <Col md={4}>
              <Panel header="Try">
                {comments('try')}
              </Panel>
            </Col>
          </Row>
          <div id="startBtn">{startBtn()}</div>
        </Row>
      </div>
    );
  }
}

RetrospectiveContainer.propTypes = {
  organization: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  permission: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    project: state.project,
    permission: state.permission,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RetrospectiveContainer);
