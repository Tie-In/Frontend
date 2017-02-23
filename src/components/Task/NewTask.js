import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';
import AutosuggestionBlock from './AutosuggestionBlock';
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
      },
    };

    this.create = this.create.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.setFeature = this.setFeature.bind(this);
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get('/api/users', {
        project: this.props.params.projectId,
      });
      const users = response.data;
      console.log(users);
      this.setState({ allUsers: users });
    } catch (err) {
      console.log(err);
    }
  }

  async create() {
    console.log(this.state);
    // try {
    //   const response = await apiHelper.post('/api/projects', {
    //     project: this.state.input,
    //   });
    //   const project = response.data;
    //   this.props.projectActions.setProject(project);
    //   document.location.href = `/organizations/${project.organization_id}/projects/${project.id}`;
    // } catch (err) {
    //   console.log(err);
    // }
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

  render() {
    const lineColor = {
      borderColor: '#7E8281',
    };
    const titleColor = {
      color: '#A25E5D',
    };
    const buttonGroup = {
      marginTop: '20px',
    };
    const singleButton = {
      marginTop: '10px',
    };
    const previousURL = `/organizations/${this.state.input.organizationId}`;

    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <h3 style={titleColor}>Create new task</h3>
                <hr style={lineColor} />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Task&#39;s name
                  </ControlLabel>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of task" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <AutosuggestionBlock title="Feature" data={this.props.project.features} setValue={this.setFeature} />
              </Col>
              <Col xs={12} md={4}>
                <AutosuggestionBlock title="Assignee (Optional)" data={this.state.allUsers} setValue={this.setAssignee} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Tags
                  </ControlLabel>
                  <FormControl
                    placeholder="Add tag"
                    valueLink={linkState(this, 'input.tags')}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <FormGroup style={buttonGroup}>
                <Col xs={12} md={3} xsOffset={0} mdOffset={3}>
                  <Button style={singleButton} bsStyle="primary" href={previousURL} key="cancel" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button style={singleButton} onClick={this.create} key="submitProject" block>
                    Create
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </Form>
        </Grid>
      </div>
    );
  }
}

NewProject.propTypes = {
  project: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
