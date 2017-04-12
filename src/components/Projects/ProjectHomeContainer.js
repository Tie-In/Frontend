import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import DocumentTitle from 'react-document-title';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';

class ProjectHomeContainer extends Component {

  async componentWillMount() {
    try {
      const response = await apiHelper.get(`/api/projects/${this.props.params.projectId}`);
      const project = response.data;
      this.props.projectActions.setProject(project);
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
    console.log(project);
    return (
      <DocumentTitle title={`${project.name}`}>
        <div className="tiein-container">
          <h3 className="header-label">{project.name}</h3>
          <hr className="header-line" />
          <p>{this.description(project.description)}</p>
          <div>
            {
              project.users.map((user) => {
                return <img src={`../../../src/images/${user.image}.png`} style={imgStyle} alt="contributor-thumbnail" data-tip={`${user.firstname} ${user.lastname}`} key={user.username} />;
              })
            }
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
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHomeContainer);
