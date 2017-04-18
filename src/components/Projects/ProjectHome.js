import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import DocumentTitle from 'react-document-title';
import * as projectActionsCreator from '../../actions/project-actions';
import * as permissionActionsCreator from '../../actions/permission-actions';
import * as apiHelper from '../../helpers/apiHelper';

class ProjectHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async componentWillMount() {
    const { params, projectActions, permissionActions, user } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
      const perLevel = project.project_contributes.find((x) => {
        return x.user_id === user.id;
      }).permission_level;
      permissionActions.setProject(perLevel);
      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
    }
  }

  description(text) {
    return text;
  }

  render() {
    const { project } = this.props;
    const imgStyle = {
      marginRight: '7px',
    };
    return (
      <DocumentTitle title={`${project.name}`}>
        { this.state.loading ? <div /> :
        <div className="tiein-container">
          <h3 className="header-label">{project.name}</h3>
          <hr className="header-line" />
          <p>{this.description(project.description)}</p>
          <br />
          <div>
            {
              project.users ? (project.users.map((user) => {
                return <img src={user.image} style={imgStyle} alt="contributor-thumbnail" data-tip={`${user.firstname} ${user.lastname}`} key={user.username} />;
              })) : <div />
            }
          </div>
          {project.effort_estimation === undefined ?
            <LinkContainer to={`/organizations/${this.props.project.organization_id}/projects/${this.props.project.id}/planning/features`}>
              <Button>Start Planning </Button>
            </LinkContainer> : null
          }
        </div>
        }
      </DocumentTitle>
    );
  }
}

ProjectHome.propTypes = {
  project: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHome);
