import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import * as projectActions from '../../actions/project-actions';

class ProjectHomeContainer extends Component {

  componentDidMount() {
    axios({
      method: 'GET',
      url: `/api/projects/${this.props.params.projectId}`,
      headers: {
        Authorization: this.props.user.auth_token,
      },
    }).then((response) => {
      const project = response.data;
      console.log(project)
      this.props.projectActions.setProject(project);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <LinkContainer to={`/organizations/${this.props.project.organization_id}/projects/${this.props.project.id}/planning/features`}>
          <Button>Start Planning </Button>
        </LinkContainer>
      </div>
    );
  }
}

ProjectHomeContainer.propTypes = {
  user: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHomeContainer);
