import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import { bindActionCreators } from 'redux';
import { Row, Col, Modal, Button, Form, FormGroup, FormControl, Grid, ControlLabel } from 'react-bootstrap';
import 'simple-line-icons/css/simple-line-icons.css';
import Style from '../../style/backlog.css';
import * as apiHelper from '../../helpers/apiHelper';
import * as backlogActions from '../../actions/backlog-actions';

class BacklogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      taskID: -1,
      backlogTasks: [],
      sprintTasks: [],
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

  showEditTaskModal(e) {
    console.log(e.target);
    const id = Number(e.target.dataset.value);
    this.setState({
      show: true,
      taskID: id,
    });
  }

  findIndex(array, id) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].id === id) {
        console.log(`Index found: ${i}`);
        return i;
      }
    }
    return -1;
  }

  switchTask(e) {
    console.log(e.target);
    const id = Number(e.target.dataset.value);
    const btn = e.target.id;
    const tempBacklogTasks = this.state.backlogTasks;
    const tempSprintTasks = this.state.sprintTasks;

    if (btn === 'addButton') {
      const index = this.findIndex(tempBacklogTasks, id);
      this.setState({ sprintTasks: this.state.sprintTasks.concat(tempBacklogTasks[index]) });
      tempBacklogTasks.splice(index, 1);
      this.setState({ backlogTasks: tempBacklogTasks });
    } else if (btn === 'removeButton') {
      const index = this.findIndex(tempSprintTasks, id);
      this.setState({ backlogTasks: this.state.backlogTasks.concat(tempSprintTasks[index]) });
      tempSprintTasks.splice(index, 1);
      this.setState({ sprintTasks: tempSprintTasks });
    }
  }

  render() {
    const backlogTaskNode = this.state.backlogTasks.map((task) => {
      return (
        <Row>
          <li key={task.id} id="task">
            <Col xs={10} md={11}><span id="taskName" data-value={task.id} onClick={this.showEditTaskModal}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-plus" data-value={task.id} id="addButton" onClick={this.switchTask} /></Col>
          </li>
        </Row>
      );
    });

    const sprintTaskNode = this.state.sprintTasks.map((task) => {
      return (
        <Row>
          <li key={task.id} id="task">
            <Col xs={10} md={10}><span id="taskName" data-value={task.id} onClick={this.showEditTaskModal}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-close" data-value={task.id} role="button" id="removeButton" onClick={this.switchTask}/></Col>
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

    const editTask = () => {
      let task = {};
      let i = -1;
      if (this.findIndex(this.state.backlogTasks, this.state.taskID) !== -1) {
        i = this.findIndex(this.state.backlogTasks, this.state.taskID);
        task = this.state.backlogTasks[i];
      } else if (this.findIndex(this.state.sprintTasks, this.state.taskID) !== -1) {
        i = this.findIndex(this.state.sprintTasks, this.state.taskID);
        task = this.state.sprintTasks[i];
      }
      return (
        <div className="editTaskContainer">
          <Form>
            <Row>
              <hr />
              <FormGroup controlId="editName">
                <ControlLabel>
                  Task
                </ControlLabel>
                <FormControl type="text" value={task.name} />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup controlId="editDescription">
                <ControlLabel>
                  Description
                </ControlLabel>
                <FormControl type="text" value={task.description} />
              </FormGroup>
            </Row>
            <Row>
              <Col md={5} id="leftColumn">
                <FormGroup controlId="">
                  <ControlLabel>
                    Feature
                  </ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
              </Col>
              <Col md={5} mdOffset={2} id="rightColumn">
                <FormGroup controlId="">
                  <ControlLabel>
                    Assignee
                  </ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={5} id="leftColumn">
                <FormGroup controlId="">
                  <ControlLabel>
                    Tag
                  </ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      );
    };

    return (
      <div className="modal-container">
        <div className="backlogContainer" style={Style}>
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
        <Modal
          show={this.state.show}
          onHide={this.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editTask()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Update</Button>
          </Modal.Footer>
        </Modal>
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
