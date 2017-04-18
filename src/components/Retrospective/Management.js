import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Category from './Category';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprints: this.props.project.sprints,
      viewpoints: [],
    };
  }

  async componentWillMount() {
    const { params, user, permissionActions, projectActions } = this.props;
    const sprintSelected = this.state.sprints[this.state.sprints.length - 1];
    try {
      const res = await apiHelper.get(`/api/retrospectives/${sprintSelected.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });

      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);

      console.log(this.state.viewpoints);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="tiein-container">
        <h3 className="header-label">Retrospective management</h3>
        <hr className="header-line" />

        <Row>
          <Col sm={12}>
            <h4>Good</h4>
            {this.state.viewpoints.map((data) => {
              const index = this.state.viewpoints.indexOf(data);
              if(data.kind === 'good') {
                return (<Category
                  key={index}
                  comment={data.comment}
                />);
              }
            })}
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h4>Bad</h4>
            {this.state.viewpoints.map((data) => {
              const index = this.state.viewpoints.indexOf(data);
              if(data.kind === 'bad') {
                return (<Category
                  key={index}
                  comment={data.comment}
                />);
              }
            })}
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h4>Try</h4>
            {this.state.viewpoints.map((data) => {
              const index = this.state.viewpoints.indexOf(data);
              if(data.kind === 'try') {
                return (<Category
                  key={index}
                  comment={data.comment}
                />);
              }
            })}
          </Col>
        </Row>
      </div>
    );
  }
}

Management.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Management);
