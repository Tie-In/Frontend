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
    };
    this.handleSetPoint = this.handleSetPoint.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks });
  }

  handleSetPoint(e, id) {
    const index = this.props.findIndex(this.state.tasks, id);
    this.setState({
      tasks: update(this.state.tasks, { [index]: { story_point: { $set: e.target.value } } }),
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
                <FormGroup controlId="point" bsSize="small" className="pull-right">
                  <FormControl
                    placeholder="Point"
                    type="number"
                    onChange={(e) => this.handleSetPoint(e, task.id)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        );
      });
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
            <Modal.Title id="contained-modal-title">Point Estimation</Modal.Title>
            <hr />
          </Modal.Header>
          <Modal.Body>
            <Row>
              {taskNode()}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.props.setSprintTasks(this.state.tasks)}>
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
  findIndex: PropTypes.func.isRequired,
  setSprintTasks: PropTypes.func.isRequired,
};

export default PointEstimationModal;
