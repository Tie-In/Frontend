import React, { Component, PropTypes } from 'react';
import { Row, Col, Panel, Glyphicon } from 'react-bootstrap';
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
    };

    this.setImportant = this.setImportant.bind(this);
    this.getImportantID = this.getImportantID.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentWillMount() {
    try {
      const res = await apiHelper.get(`/api/retrospectives/${this.state.selectedSprint.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });
      console.log(this.state.viewpoints);
    } catch (err) {
      console.log(err);
    }
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

  render() {
    const comments = (kind) => {
      if (this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          if (this.state.viewpoints && data.kind === kind) {
            return (<li>{data.comment}</li>);
          }
        });
      }
    };

    const tries = () => {
      if (this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          if (this.state.viewpoints && data.kind === 'try') {
            return (
              <div>
                <input type="checkbox" onClick={this.handleSelect} name={data.comment} id={data.id} />
                <label htmlFor={data.id}><Glyphicon glyph="star" /><Glyphicon glyph="star-empty" />{data.comment}</label>
              </div>
            );
          }
        });
      }
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
                  {comments('good')}
                </Panel>
              </Col>
              <Col md={3}>
                <Panel header="Bad">
                  {comments('bad')}
                </Panel>
              </Col>
              <Col md={3}>
                <Panel header="Try">
                  {tries()}
                </Panel>
              </Col>
              <Col md={3}>
                <Panel id="imptHeader" header="Important">
                  {imps()}
                </Panel>
              </Col>
            </Row>
          </Row>
        </div>
      </DocumentTitle>
    );
  }
}

Important.propTypes = {
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps)(Important);
