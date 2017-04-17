import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, FormGroup,
  ControlLabel, FormControl, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import update from 'immutability-helper';
import List from './List';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class NewRetrospective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      input: {
        name: '',
        type: 'good',
      },
      error: false,
    };

    this.addComment = this.addComment.bind(this);
    this.removeComment = this.removeComment.bind(this);
  }

  addComment() {
    if (this.state.input.name === '') {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });
      const temp = this.state.input;
      const commentsTemp = this.state.comments;
      commentsTemp.push(temp);
      this.setState({
        input: {
          name: '',
          type: 'good',
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

  render() {
    const { organization, project } = this.props;
    const path = `/organizations/${organization.id}/projects/${project.id}`;

    const manageButton = () => {
      if (this.state.comments.length > 0) {
        return (<Button href={`${path}/retrospective/management`}>Manage</Button>);
      }
      return (<Button className="disabled">Manage</Button>);
    };

    return (
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
                  valueLink={linkState(this, 'input.name')}
                />
              </FormGroup>
            </Col>
            <Col sm={2}>
              <FormGroup>
                <FormControl
                  componentClass="select"
                  valueLink={linkState(this, 'input.type')}
                >
                  <option value="">Select Type</option>
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
            comment={data.name} index={index}
            type={data.type}
            remove={this.removeComment}
          />);
        })}

        <div id="submitBtn">{manageButton()}</div>
      </div>
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

export default connect(mapStateToProps)(NewRetrospective);
