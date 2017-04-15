import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import DocumentTitle from 'react-document-title';
import * as projectActions from '../../actions/project-actions';
import * as permissionActions from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';

class ProjectHomeContainer extends Component {

  async componentWillMount() {
    const { params, user, permissionActions, projectActions } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
      const perLevel = project.project_contributes.find((x) => {
        return x.user_id === user.id;
      }).permission_level;
      permissionActions.setProject(perLevel);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { project } = this.props;
    const cardStyle = {
      height: '150px',
      width: '100%',
      border: 'solid 1px #E5E5E5',
      marginBottom: '50px',
    };
    return (
      <DocumentTitle title={`${project.name}`}>
        <div className="tiein-container">
          <h3 className="header-label">{project.name}</h3>
          <hr className="header-line" />
          <div className="container" style={cardStyle}>
            <p>{project.description}</p>
          </div>
          {project.effort_estimation === undefined ?
            <LinkContainer to={`/organizations/${this.props.project.organization_id}/projects/${this.props.project.id}/planning/features`}>
              <Button>Start Planning </Button>
            </LinkContainer> : null
          }
        </div>
      </DocumentTitle>
    );
  }
}

ProjectHomeContainer.propTypes = {
  project: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  permissionActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
    permissionActions: bindActionCreators(permissionActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHomeContainer);
