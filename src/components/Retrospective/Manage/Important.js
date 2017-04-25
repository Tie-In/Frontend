import React, { Component, PropTypes } from 'react';
import { Row, Col, Panel, Glyphicon, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import update from 'immutability-helper';
import 'simple-line-icons/css/simple-line-icons.css';
import * as apiHelper from '../../../helpers/apiHelper';
import '../retrospective.css';

class Important extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewpoints: [],
      selectedSprint: this.props.project.sprints[this.props.project.sprints.length - 1],
      importants: [],
      categories: [],
      found: false,
    };

    this.setImportant = this.setImportant.bind(this);
    this.getImportantID = this.getImportantID.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.doneRetrospective = this.doneRetrospective.bind(this);
  }

  async componentWillMount() {
    try {
      const res = await apiHelper.get(`/api/retrospectives/${this.state.selectedSprint.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });

      const catsRes = await apiHelper.get('/api/viewpoint_categories', {
        retrospective: this.state.selectedSprint.retrospective.id,
      });
      this.setState({ categories: catsRes.data });

      console.log(this.state.viewpoints);
      console.log(this.state.categories);
    } catch (err) {
      console.log(err);
    }
  }

  async doneRetrospective() {
    try {
      const res = await apiHelper.put(`/api/retrospectives/${this.state.selectedSprint.retrospective.id}`, {
        is_important: {
          viewpoints: this.state.importants,
        },
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    document.location.href = `/organizations/${this.props.organization.id}/projects/${this.props.project.id}/retrospective/`;
  }

  handleSelect(e) {
    const data = e.target;
    this.setImportant(data.id, data.name);
  }

  getImportantID(id) {
    let index = -1;
    this.state.importants.map((imp, i) => {
      if (imp.id === id) {
        index = i;
      }
    });
    return index;
  }

  setImportant(id, comment) {
    const { importants } = this.state;
    const temp = { id, comment };
    const index = this.getImportantID(id);

    if (importants.length === 0 || index === -1) {
      this.setState({ importants: update(importants, { $push: [temp] }) });
    } else {
      this.setState({ importants: update(importants, { $splice: [[index, 1]] }) });
    }
  }

  hasCat(comments, cat) {
    let found = false;
    comments.forEach((comment) => {
      if (cat.id === comment.viewpoint_category_id) {
        found = true;
      }
    });
    return found;
  }

  render() {
    const list = (comments, cat) => {
      return comments.map((comment) => {
        if (comment.kind === 'try' && cat.id === comment.viewpoint_category_id) {
          return (
            <div>
              <input type="checkbox" onClick={this.handleSelect} name={comment.comment} id={comment.id} />
              <label htmlFor={comment.id}><Glyphicon glyph="star" /><Glyphicon glyph="star-empty" />{comment.comment}</label>
            </div>
          );
        } else if (cat.id === comment.viewpoint_category_id) {
          return (
            <li>{comment.comment}</li>
          );
        }
      });
    };

    const commentsByCategory = (comments) => {
      return this.state.categories.map((cat) => {
        if (this.hasCat(comments, cat)) {
          return (
            <ListGroupItem>
              {cat.name}
              {list(comments, cat)}
            </ListGroupItem>
          );
        }
      });
    };

    const comments = (kind) => {
      const commentsByType = [];
      if (this.state.viewpoints) {
        this.state.viewpoints.forEach((data) => {
          if (data.kind === kind) {
            commentsByType.push(data);
          }
        });
      }
      return commentsByCategory(commentsByType);
    };

    const imps = () => {
      if (this.state.importants) {
        return this.state.importants.map((data) => {
          return (<li>{data.comment}</li>);
        });
      }
    };

    return (
      <DocumentTitle title={`${this.props.project.name}・Retrospective`}>
        <div className="tiein-container">
          <Row>
            <h3 className="header-label">Retrospective management</h3>
            <hr className="header-line" />
            <Row>
              <Col md={3}>
                <Panel header="Good">
                  <ListGroup fill>
                    {comments('good')}
                  </ListGroup>
                </Panel>
              </Col>
              <Col md={3}>
                <Panel header="Bad">
                  <ListGroup fill>
                    {comments('bad') }
                  </ListGroup>
                </Panel>
              </Col>
              <Col md={3}>
                <Panel header="Try">
                  <ListGroup fill>
                    {comments('try')}
                  </ListGroup>
                </Panel>
              </Col>
              <Col md={3}>
                <Panel id="imptHeader" header="Important">
                  {imps()}
                </Panel>
              </Col>
            </Row>
            <div id="doneBtn"><Button onClick={this.doneRetrospective}>
              Done
            </Button></div>
          </Row>
        </div>
      </DocumentTitle>
    );
  }
}

Important.propTypes = {
  project: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps)(Important);
