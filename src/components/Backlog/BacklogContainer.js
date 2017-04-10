import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import 'simple-line-icons/css/simple-line-icons.css';
import update from 'immutability-helper';
import EditTaskModal from './EditTaskModal';
import PointEstimationModal from './PointEstimationModal';
import './backlog.css';
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
    this.findIndex = this.findIndex.bind(this);
    this.closeEditTaskModal = this.closeEditTaskModal.bind(this);
    this.showPointEstimationModal = this.showPointEstimationModal.bind(this);
    this.closePointEstimationModal = this.closePointEstimationModal.bind(this);
    this.setSprintTasks = this.setSprintTasks.bind(this);
    this.sumPoints = this.sumPoints.bind(this);
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get('/api/tasks', {
        project: this.props.params.projectId,
        sprint: 'backlog',
      });
      const tasks = response.data;
      console.log(tasks);
      this.setState({ backlogTasks: tasks });
    } catch (err) {
      console.log(err);
    }
  }

  async setUpdatedTask(updatedTask) {
    let index = this.findIndex(this.state.backlogTasks, updatedTask.id);
    if (index !== -1) {
      this.setState({
        backlogTasks: update(this.state.backlogTasks, { [index]: { $set: updatedTask } }),
      });
    } else {
      index = this.findIndex(this.state.sprintTasks, updatedTask.id);
      this.setState({
        sprintTasks: update(this.state.sprintTasks, { [index]: { $set: updatedTask } }),
      });
    }

    try {
      await apiHelper.put(`/api/tasks/${updatedTask.id}`, updatedTask);
      this.closeEditTaskModal();
    } catch (err) {
      console.log(err);
    }
  }

  async setSprintTasks(tempTasks) {
    try {
      const response = await apiHelper.post('/api/sprints', {
        project_id: this.props.params.projectId,
        sprint_points: this.sumPoints(tempTasks),
        tasks: tempTasks,
      });
      this.closePointEstimationModal();
      console.log(response);
    } catch (err) {
      console.log(err.response);
    }
  }

  sumPoints(tempTasks) {
    let totalPoints = 0;
    for (let i = 0; i < tempTasks.length; i += 1) {
      if (tempTasks[i].story_point !== null) {
        totalPoints += Number(tempTasks[i].story_point);
      }
    }
    console.log(totalPoints);
    return totalPoints;
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

  findIndex(array, id) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  switchTask(tempTask, btn) {
    if (btn === 'add') {
      const index = this.findIndex(this.state.backlogTasks, tempTask.id);
      this.setState({
        sprintTasks: update(this.state.sprintTasks, { $push: [tempTask] }),
        backlogTasks: update(this.state.backlogTasks, { $splice: [[index, 1]] }),
      });
    } else {
      const index = this.findIndex(this.state.sprintTasks, tempTask.id);
      this.setState({
        backlogTasks: update(this.state.backlogTasks, { $push: [tempTask] }),
        sprintTasks: update(this.state.sprintTasks, { $splice: [[index, 1]] }),
      });
    }
  }

  render() {
    const backlogTaskNode = this.state.backlogTasks.map((task) => {
      return (
        <Row key={task.id}>
          <li id="task">
            <Col xs={10} md={11}>
              <span id="taskName" onClick={() => this.showEditTaskModal(task)}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-plus" id="addButton" onClick={() => this.switchTask(task, 'add')} /></Col>
          </li>
        </Row>
      );
    });

    const sprintTaskNode = this.state.sprintTasks.map((task) => {
      return (
        <Row key={task.id}>
          <li id="task">
            <Col xs={10} md={10}><span id="taskName" onClick={() => this.showEditTaskModal(task)}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-close" role="button" id="removeButton" onClick={() => this.switchTask(task, 'remove')} /></Col>
          </li>
        </Row>
      );
    });

    const nextButton = () => {
      if (this.state.sprintTasks.length > 0) {
        return (<Button onClick={() => this.showPointEstimationModal()}>Next</Button>);
      }
      return (<Button className="disabled">Next</Button>);
    };

    return (
      <div className="modal-container">
        <div className="tiein-container">
          <Row>
            <Col sm={8}>
              <h4>Backlog</h4>
              <hr />
              <ul className="backlog" id="taskslist">{backlogTaskNode}</ul>
            </Col>
            <Col sm={4}>
              <h4>This sprint:</h4>
              <hr />
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
        />
        <PointEstimationModal
          show={this.state.showPointEstimation}
          close={this.closePointEstimationModal}
          tasks={this.state.sprintTasks}
          findIndex={this.findIndex}
          setSprintTasks={this.setSprintTasks}
        />
      </div>
    );
  }
}

BacklogContainer.propTypes = {
  params: PropTypes.object.isRequired,
};

export default BacklogContainer;
