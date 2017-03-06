import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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

  render() {
    const { project } = this.props;
    const cardStyle = {
      height: '150px',
      width: '100%',
      border: 'solid 1px #E5E5E5',
      marginBottom: '50px',
    };
    return (
      <div className="tieinContainer">
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
