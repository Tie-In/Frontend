import React, { PropTypes, Component } from 'react';
import { Modal, Col, Button, FormGroup, ControlLabel, FormControl, Form } from 'react-bootstrap';
import linkState from 'react-link-state';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as listsActions from '../../../actions/list-actions';
import AutosuggestionBlock from '../../shared/AutosuggestionBlock';
import * as apiHelper from '../../../helpers/apiHelper';

class EditModal extends Component {
  constructor(props) {
    super(props);

    const { item } = this.props;
    this.state = {
      input: {
        name: item.name,
        description: item.description,
        feature_id: item.feature.id,
        assignee_id: item.assignee_id,
        start_date: item.start_date,
        end_date: item.end_date,
        estimate_time: item.estimate_time,
        story_point: item.story_point,
      },
      allUsers: [],
      allTags: [],
      allFeatures: [],
    };

    this.closeModal = this.closeModal.bind(this);
    this.findItem = this.findItem.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setFeature = this.setFeature.bind(this);
  }

  async componentWillMount() {
    const { item, project } = this.props;
    try {
      const responseUser = await apiHelper.get('/api/users', {
        project: item.project_id,
      });
      const users = responseUser.data;
      this.setState({ allUsers: users });

      const responseTag = await apiHelper.get('/api/tags', {
        project: item.project_id,
      });
      this.setState({ allTags: responseTag.data });
      this.setState({ allFeatures: project.features });
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

  async closeModal() {
    try {
      const response = await apiHelper.put(`/api/tasks/${this.props.item.id}`, this.state.input);
      const task = response.data;
      this.props.setShow(false);
      this.props.listsActions.setList(task);
    } catch (err) {
      console.log(err);
    }
  }

  // setTags(idArr) {
  //   const temp = this.state.input;
  //   temp.tags = idArr;
  //   this.setState({ input: temp });
  // }

  findItem(item) {
    return item.id === this.props.item.assignee_id;
  }

  render() {
    const { item } = this.props;

    return (
      <div>
        <Modal show={this.props.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Name
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Description
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="Description" valueLink={linkState(this, 'input.description')} />
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
                <Col xs={3} componentClass={ControlLabel}>
                  Start Date
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="Start date" valueLink={linkState(this, 'input.start_date')} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  End date
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="End date" valueLink={linkState(this, 'input.end_date')} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Estimate time
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="Time (hr)" valueLink={linkState(this, 'input.estimate_time')} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs={3} componentClass={ControlLabel}>
                  Story point
                </Col>
                <Col xs={9}>
                  <FormControl type="text" placeholder="Point" valueLink={linkState(this, 'input.story_point')} />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Done</Button>
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
  project: PropTypes.arrayOf(PropTypes.object).isRequired,
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
