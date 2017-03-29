import React, { PropTypes, Component } from 'react';
import update from 'immutability-helper';
import { Row, Col, Modal, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import '../../style/backlog.css';

class EditTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: this.props.task,
    };
    this.handleEditTask = this.handleEditTask.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ input: nextProps.task });
  }

  handleEditTask(e) {
    const name = e.target.name;
    this.setState({ input: update(this.state.input, { [name]: { $set: e.target.value } }) });
  }

  render() {
    const editTask = () => {
      return (
        <div className="editTaskContainer">
          <Form>
            <Row>
              <FormGroup>
                <ControlLabel>
                  Task
                </ControlLabel>
                <FormControl type="text" name="name" onChange={this.handleEditTask} value={this.state.input.name} />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <ControlLabel>
                  Description
                </ControlLabel>
                <FormControl type="text" name="description" onChange={this.handleEditTask} value={this.state.input.description} />
              </FormGroup>
            </Row>
            <Row>
              <Col md={5} id="leftColumn">
                <FormGroup>
                  <ControlLabel>
                    Feature
                  </ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
              </Col>
              <Col md={5} mdOffset={2} id="rightColumn">
                <FormGroup controlId="assignee">
                  <ControlLabel>
                    Assignee
                  </ControlLabel>
                  <FormControl type="text" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={5} id="leftColumn">
                <FormGroup controlId="tag">
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
        <Modal
          show={this.props.show}
          onHide={this.props.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Task</Modal.Title>
            <hr />
          </Modal.Header>
          <Modal.Body>
            {editTask()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.props.setUpdatedTask(this.state.input)}>Update</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

EditTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setUpdatedTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default EditTaskModal;
