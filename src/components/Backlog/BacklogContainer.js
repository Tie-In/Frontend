import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'immutability-helper';
import EditTaskModal from './EditTaskModal';
import { Row, Col, Button } from 'react-bootstrap';
import 'simple-line-icons/css/simple-line-icons.css';
import '../../style/backlog.css';
import * as apiHelper from '../../helpers/apiHelper';
import * as backlogActions from '../../actions/backlog-actions';

class BacklogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      backlogTasks: [],
      sprintTasks: [],
      task: {},
    };

    this.close = this.close.bind(this);
    this.showEditTaskModal = this.showEditTaskModal.bind(this);
    this.create = this.create.bind(this);
    this.switchTask = this.switchTask.bind(this);
    this.findIndex = this.findIndex.bind(this);
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

  async create() {
    try {
      const response = await apiHelper.post('/api/sprints', {
        data: {
          project_id: '',
          sprint_points: '',
          tasks: [{
            id: '',
            story_point: '',
          }],
        },
      });
      const tasks = response.data.data;
      this.props.backlogActions.setSprintTasks(tasks);
      // document.location.href = `/organizations/${org.id}`;
    } catch (err) {
      console.log(err.response);
    }
  }

  close() {
    this.setState({ show: false });
  }

  showEditTaskModal(tempTask) {
    this.setState({
      show: true,
      task: tempTask,
    });
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
        return (<Button>Next</Button>);
      }
      return (<Button className="disabled">Next</Button>);
    };

    return (
      <div className="modal-container">
        <div className="backlogContainer">
          <Row>
            <Col sm={8}>
              <h4>Backlog</h4>
              <hr />
              <ul className="backlog" id="taskslist">{backlogTaskNode}</ul>
            </Col>
            <Col sm={4}>
              <h4>This Sprint:</h4>
              <hr />
              <ul className="sprint" id="taskslist">{sprintTaskNode}</ul>
              <div id="nextButton">{nextButton()}</div>
            </Col>
          </Row>
        </div>
        <EditTaskModal
          task={this.state.task}
          show={this.state.show}
          close={this.close}
        />
      </div>
    );
  }
}

BacklogContainer.propTypes = {
  backlogActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    backlogActions: bindActionCreators(backlogActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BacklogContainer);
