import React, { PropTypes, Component } from 'react';
import { Row, Col, Modal, Button, FormGroup, FormControl } from 'react-bootstrap';
import update from 'immutability-helper';
import './backlog.css';

class PointEstimationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      totalPoints: 0,
      trySend: false,
    };
    this.handleSetPoint = this.handleSetPoint.bind(this);
    this.setSprint = this.setSprint.bind(this);
    this.getIndex = this.getIndex.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks });
  }

  getIndex(id) {
    const changedTask = this.state.tasks.find((x) => {
      return x.id === id;
    });
    return this.state.tasks.indexOf(changedTask);
  }

  setSprint() {
    let hasBlank = false;
    this.state.tasks.forEach((task) => {
      if (task.story_point === null) {
        hasBlank = true;
      }
    });
    if (hasBlank) {
      this.setState({ trySend: true });
    } else {
      this.setState({ trySend: false });
      this.props.setSprintTasks(this.state.tasks);
    }
  }

  handleSetPoint(e, id) {
    const index = this.getIndex(id);
    this.setState({
      tasks: update(this.state.tasks, { [index]: { story_point: { $set: e.target.value } } }),
    });
  }

  checkValue(e, id) {
    const { maxPoint } = this.props;
    const index = this.getIndex(id);
    let value = e.target.value;
    if (Number(value) > Number(maxPoint)) {
      value = maxPoint;
    } else if (value <= 0 && value !== '') {
      value = 1;
    }
    this.setState({
      tasks: update(this.state.tasks, { [index]: { story_point: { $set: value } } }),
    });
  }

  render() {
    const taskNode = () => {
      return this.state.tasks.map((task) => {
        return (
          <Col md={6} key={task.id} id="sprintTask">
            <Row>
              <Col xs={9} md={9}>
                <div id="taskName">{task.name}</div>
              </Col>
              <Col xs={3} md={3}>
                <FormGroup
                  controlId="point" bsSize="small" className="pull-right"
                  validationState={
                    (task.story_point === null || task.story_point === '') && this.state.trySend ? 'error' : null
                  }
                >
                  <FormControl
                    placeholder="Point"
                    type="number"
                    max={this.props.maxPoint} min={1}
                    value={task.story_point || ''}
                    onChange={(e) => { this.handleSetPoint(e, task.id); }}
                    onBlur={(e) => { this.checkValue(e, task.id); }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        );
      });
    };

    const totalPoint = () => {
      return this.state.tasks.reduce((acc, task) => {
        return acc + Number(task.story_point || 0);
      }, 0);
    };

    return (
      <div className="modal-container">
        <Modal
          show={this.props.show}
          onHide={this.props.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Point Estimation
              <span className="pull-right" style={{ marginRight: 15, marginTop: 5, fontSize: 14 }}>
                <p>
                  <span style={{ marginRight: 10 }}>Max point per task: {this.props.maxPoint}</span>
                  <span>Total sprint point: {totalPoint()}</span>
                </p>
              </span>
            </Modal.Title>
            <hr />
          </Modal.Header>
          <Modal.Body>
            <Row>
              {taskNode()}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.setSprint(); }}>
              Start Sprint
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

PointEstimationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSprintTasks: PropTypes.func.isRequired,
  maxPoint: PropTypes.number.isRequired,
};

export default PointEstimationModal;
