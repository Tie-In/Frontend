import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Panel, FormGroup, FormControl, Glyphicon } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import DocumentTitle from 'react-document-title';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css';

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
      contributors: [],
      status: '',
    };
    this.interval = setInterval(this.pollingData, 15000);
    this.startRetro = this.startRetro.bind(this);
    this.startManage = this.startManage.bind(this);
    this.handleSelectSprint = this.handleSelectSprint.bind(this);
    this.getPath = this.getPath.bind(this);
    this.hasUser = this.hasUser.bind(this);
  }
  async componentWillMount() {
    const { params, projectActions } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
      const temp = project.sprints[this.props.project.sprints.length - 1];
      if (temp.retrospective) {
        const res = await apiHelper.get(`/api/retrospectives/${project.sprints[this.props.project.sprints.length - 1].retrospective.id}`);
        this.setState({
          viewpoints: res.data.viewpoints,
          contributors: res.data.retrospective_contributes,
          status: res.data.status,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  getPath() {
    return `/organizations/${this.state.organization.id}/projects/${this.state.project.id}`;
  }
  async startRetro() {
    try {
      await apiHelper.post('/api/retrospectives', {
        retrospective: {
          sprint_id: this.state.selectedSprint.id,
        },
      });
    } catch (err) {
      console.log(err.response);
    }
    document.location.href = `${this.getPath()}/retrospective/new`;
  }
  async startManage() {
    try {
      await apiHelper.put(`/api/retrospectives/${this.state.selectedSprint.retrospective.id}`, {
        retrospective: {
          status: 'categorise',
        },
      });
    } catch (err) {
      console.log(err);
    }
    document.location.href = `${this.getPath()}/retrospective/management`;
  }
  async handleSelectSprint(e) {
    const tempIndex = e.target.value - 1;
    const tempSprint = this.state.sprints[tempIndex];
    try {
      const res = await apiHelper.get(`/api/retrospectives/${tempSprint.retrospective.id}`);
      this.setState({
        viewpoints: res.data.viewpoints,
        contributors: res.data.retrospective_contributes,
        status: res.data.status,
      });
      // console.log(this.state.viewpoints);
    } catch (err) {
      this.setState({ viewpoints: err.response });
      console.log(err.response);
    }
    this.setState({
      selectedIndex: tempIndex,
      selectedSprint: tempSprint,
    });
  }
  hasUser() {
    let has = false;
    this.state.contributors.forEach((user) => {
      if (user.user_id === this.props.user.id) {
        has = true;
      }
    });
    return has;
  }
  render() {
    const imgStyle = {
      marginRight: '7px',
    };
    const latestSprint = this.state.sprints[this.state.sprints.length - 1];
    const selectSprint = this.state.sprints.map((sprint) => {
      if (sprint.number === this.state.sprints.length) {
        return (
          <option key={sprint.number} value={sprint.number} selected>Sprint {sprint.number}</option>
        );
      }
      return (
        <option key={sprint.number} value={sprint.number}>Sprint {sprint.number}</option>
      );
    });
    const startBtn = () => {
      if (this.state.permission === 'admin') {
        if (!this.state.selectedSprint.is_ended) {
          return (<Button className="disabled">Start Retrospective</Button>);
        } else if ((this.state.viewpoints === undefined || this.state.viewpoints.length === 0)
          && this.state.status !== 'in_progress') {
          return (<Button onClick={this.startRetro}>Start Retrospective</Button>);
        } else if (this.state.selectedSprint === latestSprint && this.state.status === 'in_progress') {
          return (<Button onClick={this.startManage}>Manage</Button>);
        }
      } else if (this.state.selectedSprint === latestSprint && this.state.status === 'in_progress'
        && this.state.selectedSprint.is_ended && !this.hasUser()) {
        return (<Button href={`${this.getPath()}/retrospective/new`}>Join</Button>);
      }
    };
    const comments = (kind) => {
      if (this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          if (this.state.viewpoints && data.kind === 'try' && data.kind === kind) {
            if (data.is_important) {
              return (<li key={data.id} id="tryList"><Glyphicon glyph="star" />{data.comment}</li>);
            }
            return (<li key={data.id}>{data.comment}</li>);
          } else if (this.state.viewpoints && data.kind === kind) {
            return (<li key={data.id}>{data.comment}</li>);
          }
        });
      }
    };
    const users = () => {
      const ids = [];
      return this.state.contributors.map((user) => {
        if (ids.indexOf(user.user_id) === -1) {
          ids.push(user.user_id);
          return (
            <div key={user.id} className="pull-right">
              <img
                src={user.user.image}
                style={imgStyle}
                alt="contributor-thumbnail"
                data-tip={`${user.user.firstname} ${user.user.lastname}`}
                key={user.user.username}
              />
            </div>
          );
        }
      });
    };

    return (
      <DocumentTitle title={`${this.props.project.name}・Retrospective`}>
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
                    {selectSprint}
                  </FormControl>
                </FormGroup>
              </Col>
              <Col md={4}>
                <p>Latest retrospective: {latestSprint.number - 1}</p>
                <p>Current sprint: {latestSprint.number}</p>
              </Col>
              <Col md={6}>
                {users()}
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
          <ReactTooltip effect="solid" place="bottom" />
        </div>
      </DocumentTitle>
    );
  }
}
RetrospectiveContainer.propTypes = {
  organization: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  permission: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    organization: state.organization,
    project: state.project,
    permission: state.permission,
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RetrospectiveContainer);
