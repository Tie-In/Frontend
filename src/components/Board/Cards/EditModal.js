import React, { PropTypes, Component } from 'react';
import { Modal, Col, Button, FormGroup, ControlLabel, FormControl, Form } from 'react-bootstrap';
import update from 'react-addons-update';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AutosuggestionBlock from '../../shared/AutosuggestionBlock';
import * as listsActions from '../../../actions/list-actions';
import * as apiHelper from '../../../helpers/apiHelper';
import TagRow from './TagRow';

class EditModal extends Component {
  constructor(props) {
    super(props);

    const { item } = this.props;
    this.state = {
      input: {
        name: item.name,
        description: item.description,
        feature_id: (item.feature ? item.feature.id : ''),
        assignee_id: item.assignee_id,
        start_date: item.start_date,
        end_date: item.end_date,
        estimate_time: item.estimate_time,
        story_point: item.story_point,
        tags: item.tags,
      },
      allUsers: [],
      allTags: [],
      allFeatures: [],
    };

    this.closeModal = this.closeModal.bind(this);
    this.findItem = this.findItem.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setFeature = this.setFeature.bind(this);
    this.setTags = this.setTags.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateTask = this.updateTask.bind(this);
  }

  async componentWillMount() {
    const { item, project } = this.props;
    try {
      const responseUser = await apiHelper.get('/api/users', {
        project: item.project_id,
      }, true);
      const users = responseUser.data;
      const responseTag = await apiHelper.get('/api/tags', {
        project: item.project_id,
      });
      this.setState({ 
        allUsers: users,
        allTags: responseTag.data,
        allFeatures: project.features, 
      });
    } catch (err) {
      console.log(err);
    }
  }

  setAssignee(id) {
    const temp = this.state.input;
    temp.assignee_id = id;
    this.setState({ input: temp });
  }

  setFeature(id) {
    const temp = this.state.input;
    temp.feature_id = id;
    this.setState({ input: temp });
  }

  async updateTask() {
    try {
      const response = await apiHelper.put(`/api/tasks/${this.props.item.id}`, this.state.input);
      const task = response.data.task;
      const statuses = response.data.statuses;
      this.props.setShow(false, task);
      this.props.listsActions.setList(statuses);
    } catch (err) {
      console.log(err);
    }
  }

  closeModal() {
    this.props.setShow(false, this.props.item);
  }

  setTags(idArr) {
    const temp = this.state.input;
    temp.tags = idArr;
    this.setState({ input: temp });
  }

  findItem(item) {
    return item.id === this.props.item.assignee_id;
  }

   handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      input: update(this.state.input, {
        [name]: { $set: value },
      }),
    });
  }

  render() {
    const { item } = this.props;
    const { input } = this.state;
    return (
      <div>
        <Modal show={this.props.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit task
              <hr />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Name
                </Col>
                <Col xs={9}>
                  <FormControl 
                    type="text" placeholder="Name" 
                    name="name"
                    value={input.name || ''}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Description
                </Col>
                <Col xs={9}>
                  <FormControl 
                    type="text" placeholder="Description"
                    name="description" 
                    value={input.description || ''}
                    onChange={this.handleInputChange} 
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Feature
                </Col>
                <Col xs={9}>
                  <AutosuggestionBlock
                    data={this.state.allFeatures}
                    setValue={this.setFeature} initSelect={item.feature}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Assignee
                </Col>
                <Col xs={9}>
                  <AutosuggestionBlock
                    data={this.state.allUsers}
                    setValue={this.setAssignee}
                    initSelect={this.state.allUsers.find(this.findItem)}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <TagRow
                  data={this.state.allTags} setValue={this.setTags}
                  projectId={this.props.project.id}
                  initSelect={item.tags}
                />
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Start Date
                </Col>
                <Col xs={3}>
                  <FormControl 
                    type="text" placeholder="Start date" 
                    name="start_date"
                    value={input.start_date || ''}
                    onChange={this.handleInputChange} 
                  />
                </Col>
                <Col xs={3} componentClass={ControlLabel}>
                  End date
                </Col>
                <Col xs={3}>
                  <FormControl 
                    type="text" placeholder="End date" 
                    name="end_date"
                    value={input.end_date || ''}
                    onChange={this.handleInputChange} 
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Estimate time
                </Col>
                <Col xs={3}>
                  <FormControl 
                    type="text" placeholder="Time (hr)" 
                    name="estimate_time"
                    value={input.estimate_time || ''}
                    onChange={this.handleInputChange} 
                  />
                </Col>
                <Col xs={3} componentClass={ControlLabel}>
                  Story point
                </Col>
                <Col xs={3}>
                  <FormControl 
                    type="text" placeholder="Point" 
                    name="story_point"
                    value={input.story_point || ''}
                    onChange={this.handleInputChange} 
                  />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.updateTask}>Update</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

EditModal.propTypes = {
  item: PropTypes.object.isRequired,
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listsActions: bindActionCreators(listsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
