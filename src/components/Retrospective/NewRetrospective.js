import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap';
import update from 'react-addons-update';
import DocumentTitle from 'react-document-title';
import List from './List';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css';

class NewRetrospective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      input: {
        comment: '',
        kind: 'good',
      },
      error: false,
    };

    this.addComment = this.addComment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.setComments = this.setComments.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentWillMount() {
    const { params, projectActions } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
    } catch (err) {
      console.log(err);
    }
  }

  addComment() {
    if (this.state.input.comment === '') {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });
      const temp = this.state.input;
      const commentsTemp = this.state.comments;
      commentsTemp.push(temp);
      this.setState({
        input: {
          comment: '',
          kind: 'good',
        },
        comments: commentsTemp,
      });
    }
  }

  doSomething(e) {
    e.preventDefault();
  }

  removeComment(index) {
    const temp = this.state.comments;
    temp.splice(index, 1);
    this.setState({ comments: temp });
  }

  async setComments() {
    const { organization, project } = this.props;
    const path = `/organizations/${organization.id}/projects/${project.id}`;
    const latestSprint = this.props.project.sprints[this.props.project.sprints.length - 1];

    try {
      const res = await apiHelper.post('/api/viewpoints', {
        viewpoints: this.state.comments,
        retrospective_id: latestSprint.retrospective.id,
      });
    } catch (err) {
      console.log(err.response);
    }
    document.location.href = `${path}/retrospective`;
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
    const { input } = this.state;
    const submitButton = () => {
      if (this.state.comments.length > 0) {
        return (<Button onClick={this.setComments}>Submit</Button>);
      }
      return (<Button className="disabled">Submit</Button>);
    };

    return (
      <DocumentTitle title={`${this.props.project.name}・Retrospective`}>
        <div className="tiein-container">
          <h3 className="header-label">Add new comment</h3>
          <hr className="header-line" />
          <form onSubmit={this.doSomething}>
            <Row>
              <Col sm={8}>
                <FormGroup validationState={this.state.error ? 'error' : null}>
                  <FormControl
                    id="nameField"
                    placeholder="Add comment"
                    name="comment"
                    value={input.comment}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col sm={2}>
                <FormGroup>
                  <FormControl
                    componentClass="select"
                    name="kind"
                    value={input.kind}
                    onChange={this.handleInputChange}
                  >
                    <option value="good">Good</option>
                    <option value="bad">Bad</option>
                    <option value="try">Try</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={2}>
                <FormGroup>
                  <Button id="addBtn" onClick={this.addComment} type="submit" block>Add</Button>
                </FormGroup>
              </Col>
            </Row>
          </form>
          {this.state.comments.map((data) => {
            const index = this.state.comments.indexOf(data);
            return (<List
              key={index}
              comment={data.comment} index={index}
              kind={data.kind}
              remove={this.removeComment}
            />);
          })}

          <div id="submitBtn">{submitButton()}</div>
        </div>
      </DocumentTitle>
    );
  }
}

NewRetrospective.propTypes = {
  organization: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRetrospective);
