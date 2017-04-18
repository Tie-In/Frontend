import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'immutability-helper';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewpoints: [],
    };
  }

  // async componentWillMount() {
  //   try {
  //     const response = await apiHelper.get(`/api/retrospectives/${}`);
  //     const data = response.data;
  //     this.setState({ comments: data });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async componentWillMount() {
  //   const { params, user, permissionActions, projectActions, project } = this.props;
  //   const sprintSelected = this.state.sprints[this.state.sprints.length - 1];
  //   try {
  //     const res = await apiHelper.get(`/api/retrospectives/${sprintSelected.retrospective.id}`);
  //     this.setState({ viewpoints: res.data.viewpoints });
  //
  //     const response = await apiHelper.get(`/api/projects/${params.projectId}`);
  //     const project = response.data;
  //     projectActions.setProject(project);
  //
  //     const perLevel = project.project_contributes.find((x) => {
  //       return x.user_id === user.id;
  //     }).permission_level;
  //     permissionActions.setProject(perLevel);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   console.log(this.props.project);
  // }

  render() {
    return (
      <div className="tiein-container">
        <h3 className="header-label">Retrospective management</h3>
        <hr className="header-line" />
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
