import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Label } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'simple-line-icons/css/simple-line-icons.css';
import update from 'immutability-helper';
import CurrentSprint from './CurrentSprint';
import EditTaskModal from './EditTaskModal';
import PointEstimationModal from './PointEstimationModal';
import './backlog.css';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';

class BacklogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditTask: false,
      showPointEstimation: false,
      backlogTasks: [],
      sprintTasks: [],
      task: {},
    };

    this.setUpdatedTask = this.setUpdatedTask.bind(this);
    this.showEditTaskModal = this.showEditTaskModal.bind(this);
    this.switchTask = this.switchTask.bind(this);
    this.closeEditTaskModal = this.closeEditTaskModal.bind(this);
    this.showPointEstimationModal = this.showPointEstimationModal.bind(this);
    this.closePointEstimationModal = this.closePointEstimationModal.bind(this);
    this.setSprintTasks = this.setSprintTasks.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }

  async componentWillMount() {
    this.reloadPage();
  }

  async setUpdatedTask(updatedTask) {
    try {
      await apiHelper.put(`/api/tasks/${updatedTask.id}`, updatedTask);
      this.closeEditTaskModal();
      await this.reloadPage();
    } catch (err) {
      console.log(err);
    }
  }

  async setSprintTasks(tempTasks) {
    const { project } = this.props;
    const totalPoints = tempTasks.map((x) => {
      return Number(x.story_point);
    }).reduce((acc, val) => { return acc + val; }, 0);
    try {
      await apiHelper.post('/api/sprints', {
        sprint: {
          project_id: project.id,
          sprint_points: totalPoints,
        },
        tasks: tempTasks,
      });
      this.closePointEstimationModal();
      document.location.href = `/organizations/${project.organization_id}/projects/${project.id}/board`;
    } catch (err) {
      console.log(err.response);
    }
  }

  async reloadPage() {
    try {
      const responseProject = await apiHelper.get(`/api/projects/${this.props.params.projectId}`);
      const project = responseProject.data;
      this.props.projectActions.setProject(project);

      const response = await apiHelper.get('/api/tasks', {
        project: this.props.params.projectId,
        sprint: 'backlog',
      });
      const tasks = response.data;
      this.setState({ backlogTasks: tasks });
    } catch (err) {
      console.log(err);
    }
  }

  closeEditTaskModal() {
    this.setState({ showEditTask: false });
  }

  showEditTaskModal(tempTask) {
    this.setState({
      showEditTask: true,
      task: tempTask,
    });
  }

  showPointEstimationModal() {
    this.setState({ showPointEstimation: true });
  }

  closePointEstimationModal() {
    this.setState({ showPointEstimation: false });
  }

  switchTask(tempTask, btn) {
    const { backlogTasks, sprintTasks } = this.state;
    if (btn === 'add') {
      const movedTask = backlogTasks.find((x) => {
        return x.id === tempTask.id;
      });
      const index = backlogTasks.indexOf(movedTask);
      this.setState({
        sprintTasks: update(sprintTasks, { $push: [tempTask] }),
        backlogTasks: update(backlogTasks, { $splice: [[index, 1]] }),
      });
    } else {
      const movedTask = sprintTasks.find((x) => {
        return x.id === tempTask.id;
      });
      const index = sprintTasks.indexOf(movedTask);
      this.setState({
        backlogTasks: update(backlogTasks, { $push: [tempTask] }),
        sprintTasks: update(sprintTasks, { $splice: [[index, 1]] }),
      });
    }
  }

  render() {
    const { project } = this.props;
    const rowStyle = {
      paddingTop: 5,
      paddingBottom: 5,
    };
    const backlogTaskNode = this.state.backlogTasks.map((task) => {
      return (
        <Row key={task.id} style={rowStyle}>
          <li id="task">
            <Col xs={10} md={11} onClick={() => { this.showEditTaskModal(task); }}>
              <span id="taskName">
                {task.name}
                { task.feature ?
                  <Label className="pull-right" style={{ marginTop: 3 }}>
                    {task.feature.name}
                  </Label> : <div />
                }
              </span>
            </Col>
            { this.props.project.current_sprint_id === null ?
              <Col xs={1} md={1}>
                <span className="icon-plus" id="addButton" onClick={() => { this.switchTask(task, 'add'); }} />
              </Col> : <div />
            }
          </li>
        </Row>
      );
    });

    const sprintTaskNode = this.state.sprintTasks.map((task) => {
      return (
        <Row key={task.id} style={rowStyle}>
          <li id="task">
            <Col xs={10} md={10} onClick={() => { this.showEditTaskModal(task); }}>
              <span id="taskName">{task.name}
                { task.feature ?
                  <Label className="pull-right" style={{ marginTop: 3 }}>
                    {task.feature.name}
                  </Label> : <div />
                }
              </span>
            </Col>
            <Col xs={1} md={1}>
              <span
                className="icon-close" role="button"
                id="removeButton" onClick={() => { this.switchTask(task, 'remove'); }}
              />
            </Col>
          </li>
        </Row>
      );
    });

    const nextButton = () => {
      if (this.state.sprintTasks.length > 0) {
        return (<Button onClick={() => { this.showPointEstimationModal(); }}>Next</Button>);
      }
      return (<Button className="disabled">Next</Button>);
    };

    return (
      <div>
        <div className="tiein-container">
          { project.current_sprint_id !== null ?
            <div>
              <CurrentSprint reloadPage={this.reloadPage} project={project} />
              <br />
            </div> : <div />
          }
          <Row>
            <Col sm={8}>
              <h3 className="header-label">Backlog</h3>
              <hr className="header-line" />
              <ul className="backlog" id="taskslist">{backlogTaskNode}</ul>
            </Col>
            <Col sm={4}>
              <h3 className="header-label">New sprint:</h3>
              <hr className="header-line" />
              <ul className="sprint" id="taskslist">{sprintTaskNode}</ul>
              <div id="nextButton">{nextButton()}</div>
            </Col>
          </Row>
        </div>
        <EditTaskModal
          task={this.state.task}
          show={this.state.showEditTask}
          setUpdatedTask={this.setUpdatedTask}
          close={this.closeEditTaskModal}
          project={this.props.project}
        />
        <PointEstimationModal
          show={this.state.showPointEstimation}
          close={this.closePointEstimationModal}
          tasks={this.state.sprintTasks}
          setSprintTasks={this.setSprintTasks}
        />
      </div>
    );
  }
}

BacklogContainer.propTypes = {
  params: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BacklogContainer);
