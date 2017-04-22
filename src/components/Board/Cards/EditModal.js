import React, { PropTypes, Component } from 'react';
import { Modal, Col, Button, FormGroup, ControlLabel, FormControl, Form } from 'react-bootstrap';
import update from 'react-addons-update';
import AutosuggestionBlock from '../../shared/AutosuggestionBlock';
import TagRow from './TagRow';

class EditModal extends Component {
  constructor(props) {
    super(props);

    const { item } = this.props;
    const tempItem = item;``
    this.state = {
      input: {
        name: tempItem.name,
        description: tempItem.description,
        feature_id: (tempItem.feature ? tempItem.feature.id : ''),
        assignee_id: tempItem.assignee_id,
        start_date: tempItem.start_date,
        end_date: tempItem.end_date,
        estimate_time: tempItem.estimate_time,
        story_point: tempItem.story_point,
        tags: tempItem.tags,
      },
    };

    this.closeModal = this.closeModal.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setFeature = this.setFeature.bind(this);
    this.setTags = this.setTags.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateTask = this.updateTask.bind(this);
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

  setTags(idArr) {
    const temp = this.state.input;
    temp.tags = idArr;
    this.setState({ input: temp });
  }

  updateTask() {
    this.props.setShow(false, this.state.input);
  }

  closeModal() {
    this.props.setShow(false, undefined);
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
        <Modal show={this.props.show} onHide={() => { this.closeModal(); }}>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit task
              <hr />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                    data={this.props.featureSelection}
                    setValue={this.setFeature} initSelect={item.feature}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
                  Assignee
                </Col>
                <Col xs={8}>
                  <AutosuggestionBlock
                    data={this.props.userSelection}
                    setValue={this.setAssignee}
                    initSelect={item.user}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <TagRow
                  data={this.props.tagSelection} setValue={this.setTags}
                  projectId={item.project_id}
                  initSelect={item.tags}
                />
              </FormGroup>
              <FormGroup>
                <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
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
                <Col xs={2} componentClass={ControlLabel}>
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
                <Col xs={2} xsOffset={1} componentClass={ControlLabel}>
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
                <Col xs={2} componentClass={ControlLabel}>
                  Story point
                </Col>
                <Col xs={3}>
                  <FormControl
                    type="text" placeholder="Point"
                    name="story_point"
                    value={input.story_point || ''}
                    onChange={this.handleInputChange}
                    disabled
                  />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.updateTask(); }}>Update</Button>
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
  userSelection: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagSelection: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureSelection: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default (EditModal);
