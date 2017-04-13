import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import 'simple-line-icons/css/simple-line-icons.css';
import update from 'immutability-helper';
import EditTaskModal from './EditTaskModal';
import PointEstimationModal from './PointEstimationModal';
import './backlog.css';
import * as apiHelper from '../../helpers/apiHelper';

class CurrentSprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: {},
      currentTasks: [],
      showEditTask: false,
      task: {},
    };

    this.setUpdatedTask = this.setUpdatedTask.bind(this);
    this.showEditTaskModal = this.showEditTaskModal.bind(this);
    this.closeEditTaskModal = this.closeEditTaskModal.bind(this);
  }

  async componentWillMount() {
    const { project } = this.props;
    try {
      const response = await apiHelper.get('/api/tasks', {
        project: project.id,
        sprint: project.current_sprint_id,
      });
      const tasks = response.data;
      this.setState({ currentTasks: tasks });

      const responseSprint = await apiHelper.get(`/api/sprints/${project.current_sprint_id}`);
      const data = responseSprint.data;
      this.setState({ sprint: data.sprint });
      console.log(data.sprint);
    } catch (err) {
      console.log(err);
    }
  }

  showEditTaskModal(tempTask) {
    this.setState({
      showEditTask: true,
      task: tempTask,
    });
  }

  closeEditTaskModal() {
    this.setState({ showEditTask: false });
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

  render() {
    const { sprint } = this.state;
    const rowStyle = {
      paddingTop: 5,
      paddingBottom: 5,
    };
    const currentTaskNode = this.state.currentTasks.map((task) => {
      return (
        <Row key={task.id} style={rowStyle}>
          <li id="task">
            <Col xs={12}>
              <span id="taskName">
                {task.name}<Badge pullRight>{task.story_point}</Badge>
              </span>
            </Col>
          </li>
        </Row>
      );
    });
    return (
      <div>
        <Row style={{ borderBottom: 'solid 1px' }}>
          <Col sm={4}>
            <h4>Sprint {sprint.number} (Current)</h4>
          </Col>
          <Col sm={3}>
            <p style={{ paddingTop: 10 }}>Sprint points: {sprint.sprint_points}</p>
          </Col>
          <Col sm={3}>
            <p style={{ paddingTop: 10 }}>Start date: {moment(sprint.start_date).format('L')}</p>
          </Col>
          <Col sm={2}>
            <Button>Stop sprint</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={12}>
            <ul className="backlog" id="taskslist">{currentTaskNode}</ul>
          </Col>
        </Row>
        <EditTaskModal
          task={this.state.task}
          show={this.state.showEditTask}
          setUpdatedTask={this.setUpdatedTask}
          close={this.closeEditTaskModal}
          project={this.props.project}
        />
      </div>
    );
  }
}

CurrentSprint.propTypes = {
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps)(CurrentSprint);
