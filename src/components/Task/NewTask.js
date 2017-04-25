import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import DocumentTitle from 'react-document-title';
import * as apiHelper from '../../helpers/apiHelper';
import AutosuggestionBlock from '../shared/AutosuggestionBlock';
import TagRow from './TagRow';
import '../../style/autosuggestStyle.css';

class NewProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        name: '',
        description: '',
        assignee_id: '',
        project_id: this.props.params.projectId,
        feature_id: '',
        tags: [],
      },
      error: '',
    };

    this.create = this.create.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setFeature = this.setFeature.bind(this);
    this.setTags = this.setTags.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentWillMount() {
    try {
      const responseUser = await apiHelper.get('/api/users', {
        project: this.props.params.projectId,
      }, true);
      const users = responseUser.data;
      this.setState({ allUsers: users });

      const responseTag = await apiHelper.get('/api/tags', {
        project: this.props.params.projectId,
      });
      this.setState({ allTags: responseTag.data });
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

  setTags(idArr) {
    const temp = this.state.input;
    temp.tags = idArr;
    this.setState({ input: temp });
  }

  async create() {
    if (this.state.input.name !== '') {
      try {
        await apiHelper.post('/api/tasks', this.state.input);
        location.reload();
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({ error: "Task's name is required" });
    }
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
    const { project, params } = this.props;
    const { error } = this.state;
    const buttonGroup = {
      marginTop: '20px',
    };
    const singleButton = {
      marginTop: '10px',
    };
    const previousURL = `/organizations/${params.organizationId}/projects/${project.id}`;

    return (
      <DocumentTitle title={`${project.name}・New Task`}>
        <div className="tiein-container">
          <form>
            <Row>
              <Col xs={12}>
                <h3 className="header-label">Create new task</h3>
                <hr className="header-line" />
                <FormGroup controlId="formInlineName" validationState={error === '' ? null : 'error'}>
                  <ControlLabel>
                    Task&#39;s name
                  </ControlLabel>
                  <FormControl
                    type="text" placeholder="Name"
                    name="name"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description
                  </ControlLabel>
                  <FormControl
                    type="text" placeholder="Description of task"
                    name="description"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <ControlLabel>
                  Feature
                </ControlLabel>
                <AutosuggestionBlock
                  data={this.props.project.features || []} setValue={this.setFeature}
                />
              </Col>
              <Col xs={12} md={6}>
                <ControlLabel>
                  Assignee (Optional)
                </ControlLabel>
                <AutosuggestionBlock
                  data={this.state.allUsers || []} setValue={this.setAssignee}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <TagRow
                data={this.state.allTags || []} setValue={this.setTags}
                projectId={this.props.params.projectId}
              />
            </Row>
            <Row>
              <FormGroup style={buttonGroup}>
                <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                  <Button style={singleButton} bsStyle="primary" href={previousURL} key="cancel" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={4}>
                  <Button style={singleButton} onClick={this.create} key="submitProject" block>
                    Create
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </form>
        </div>
      </DocumentTitle>
    );
  }
}

NewProject.propTypes = {
  project: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    project: state.project,
  };
}

export default connect(mapStateToProps)(NewProject);
