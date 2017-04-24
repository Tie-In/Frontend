import React, { PropTypes, Component } from 'react';
import update from 'react-addons-update';
import { Col, Modal, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import AutosuggestionBlock from '../shared/AutosuggestionBlock';
import * as apiHelper from '../../helpers/apiHelper';
import TagRow from './TagRow';
import './backlog.css';

class EditTaskModal extends Component {
  constructor(props) {
    super(props);
    const { task } = props;
    this.state = {
      input: {
        name: task.name,
        description: task.description,
        feature_id: (task.feature ? task.feature.id : ''),
        assignee_id: task.assignee_id,
        start_date: task.start_date,
        end_date: task.end_date,
        estimate_time: task.estimate_time,
        story_point: task.story_point,
        tags: task.tags,
      },
      allFeatures: [],
      allUsers: [],
      allTags: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setFeature = this.setFeature.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  async componentWillMount() {
    const { project } = this.props;
    try {
      const responseUser = await apiHelper.get('/api/users', {
        project: project.id,
      }, true);
      const users = responseUser.data;
      this.setState({ allUsers: users });

      const responseTag = await apiHelper.get('/api/tags', {
        project: project.id,
      });
      this.setState({ allTags: responseTag.data });
      this.setState({ allFeatures: project.features });
    } catch (err) {
      console.log(err);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ input: nextProps.task });
  }

  setFeature(id) {
    const temp = this.state.input;
    temp.feature_id = id;
    this.setState({ input: temp });
  }

  setAssignee(id) {
    const temp = this.state.input;
    temp.assignee_id = id;
    this.setState({ input: temp });
  }

  setTags(idArr) {
    const temp = this.state.input;
    const renew = idArr.map((t) => { return this.state.allTags.find((tag) => { return tag.id === t.id; }); });
    temp.tags = renew;
    this.setState({ input: temp });
  }

  handleInputChange(e) {
    const name = e.target.name;
    this.setState({ input: update(this.state.input, { [name]: { $set: e.target.value } }) });
  }

  render() {
    const { input } = this.state;
    const editTask = () => {
      return (
        <div className="editTaskContainer">
          <Form horizontal>
            <FormGroup>
              <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
                Name
              </Col>
              <Col xs={8}>
                <FormControl
                  type="text" placeholder="Name"
                  name="name"
                  value={input.name || ''}
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
                Description
              </Col>
              <Col xs={8}>
                <FormControl
                  type="text" placeholder="Description"
                  name="description"
                  value={input.description || ''}
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
                Feature
              </Col>
              <Col xs={8}>
                <AutosuggestionBlock
                  data={this.state.allFeatures}
                  setValue={this.setFeature} initSelect={input.feature}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
                Assignee
              </Col>
              <Col xs={8}>
                <AutosuggestionBlock
                  data={this.state.allUsers}
                  setValue={this.setAssignee}
                  initSelect={this.state.allUsers.find((x) => {
                    return x.id === this.props.task.assignee_id;
                  })}
                />
              </Col>
            </FormGroup>
            { this.state.allTags ?
              <FormGroup>
                <TagRow
                  data={this.state.allTags} setValue={this.setTags}
                  projectId={this.props.project.id}
                  initSelect={input.tags}
                />
              </FormGroup> : <div />
            }
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
            <Modal.Title id="contained-modal-title">Edit task</Modal.Title>
            <hr />
          </Modal.Header>
          <Modal.Body>
            {editTask()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.props.setUpdatedTask(this.state.input); }}>Update</Button>
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
  project: PropTypes.object.isRequired,
};

export default EditTaskModal;
