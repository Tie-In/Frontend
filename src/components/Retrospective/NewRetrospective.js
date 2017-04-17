import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, FormGroup,
  ControlLabel, FormControl, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import update from 'immutability-helper';
import List from './List';
import * as apiHelper from '../../helpers/apiHelper';
import * as retrospectiveActions from '../../actions/planning-actions';
import './retrospective.css'

class NewRetrospective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.retrospective.comments,
      input: {
        name: '',
        type: 'good',
      },
      error: false,
    };

    this.addComment = this.addComment.bind(this);
    // this.sendComments = this.sendComment.bind(this);
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

  sendComments() {
    this.props.retrospectiveActions.setComments(this.state.comments);
    // document.location.href = 'effort-estimation';
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
                  id="selectType"
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

        <div id="submitBtn"><Button>Next</Button></div>
      </div>
    );
  }
}

NewRetrospective.propTypes = {
  retrospective: PropTypes.object.isRequired,
  retrospectiveActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    retrospective: state.retrospective,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    retrospectiveActions: bindActionCreators(retrospectiveActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRetrospective);
