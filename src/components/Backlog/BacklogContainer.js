import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import 'simple-line-icons/css/simple-line-icons.css';
import Style from '../../style/backlog.css';

class BacklogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      taskID: 0,
      data: [
        { id: 0, name: 'task wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdf', completed: false },
        { id: 1, name: 'wf;l,pqwlkgp[wpoekgasfsafAsf]', completed: false },
        { id: 2, name: 'fsegeryweoprpqwol;f,p[aqf]', completed: false },
        { id: 3, name: 'eswtweoitowpktiuq0[ro]', completed: false },
        { id: 4, name: 'wetawkeipotiwpoeltkkoww sprint', completed: false },
        { id: 5, name: 'ewrwrp3oprlokdg,ld', completed: false },
        { id: 6, name: 'ssdger[prkewjfk]', completed: false },
        { id: 7, name: 'wrw3twqr', completed: false },
      ],
    };
    this.close = this.close.bind(this);
    this.openModal = this.openModal.bind(this);
    this.toggleTask = this.toggleTask.bind(this);
  }

  toggleTask(id) {
    const tasks = this.state.data;
    const task = tasks[id];
    const completed = task.completed;
    task.completed = !completed;

    this.setState({ data: tasks });
  }

  close() {
    this.setState({ show: false });
  }

  openModal(id) {
    this.setState({
      show: true,
      taskID: id,
    });
  }

  render() {
    const backlogTaskNode = this.state.data.map((task) => {
      return (
        <Row>
          <li key={task.id} id="task" className={task.completed === true ? 'completed' : ''}>
            <Col xs={10} md={11}><span id="taskName" onClick={() => this.openModal(task.id)}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-plus" id="addButton" onClick={() => this.toggleTask(task.id)} /></Col>
          </li>
        </Row>
      );
    });
    const sprintTaskNode = this.state.data.map((task) => {
      if (task.completed) {
        console.log(task);
        return (
          <Row>
            <li key={task.id} id="task" className={task.completed === true ? 'completed' : ''}>
              <Col xs={10} md={10}><span id="taskName" onClick={() => this.openModal(task.id)}>{task.name}</span></Col>
              <Col xs={1} md={1}><span className="icon-close" role="button" id="removeButton" onClick={() => this.toggleTask(task.id)}/></Col>
            </li>
          </Row>
        );
      }
      return null;
    });

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
              <h4>This sprint: </h4>
              <hr />
              <ul className="sprint" id="taskslist">{sprintTaskNode}</ul>
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
            <Modal.Title id="contained-modal-title">{this.state.data[this.state.taskID].name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Elit est explicabo .
            wqfklm;lwEM
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(BacklogContainer);
