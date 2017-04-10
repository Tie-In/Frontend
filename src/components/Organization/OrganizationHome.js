import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Image } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ProjectCard from './ProjectCard';
import * as organizationActions from '../../actions/organization-actions';
import AddProject from '../../images/newproject.png';
import * as apiHelper from '../../helpers/apiHelper';

class OrganizationHome extends Component {

  async componentWillMount() {
    try {
      const response = await apiHelper.get(`/api/organizations/${this.props.params.organizationId}`);
      const org = response.data;
      this.props.organizationActions.setOrganization(org);
    } catch (err) {
      console.log(err);
      localStorage.clear();
      document.location.href = '/login';
    }
  }

  buttonType(projects) {
    const newProjectPath = `./${this.props.params.organizationId}/projects/new`;
    const articleStyles = {
      margin: '0 auto',
      position: 'fixed',
      top: 200,
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    const buttonDefaultStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
    };
    if (projects.length > 0) {
      return (<Button href={newProjectPath}>
        Create new project
      </Button>);
    }
    return (
      <div style={articleStyles} href={newProjectPath}>
        <a>
          <Image src={AddProject} alt="Image" />
        </a>
        <br />
        <Button href={newProjectPath} style={buttonDefaultStyle}>
          Create new project
        </Button>
      </div>
    );
  }

  render() {
    const { organization } = this.props;
    return (
      <DocumentTitle title={organization.name}>
        { organization.projects !== undefined ?
          <div className="tiein-container">
            <h3 className="header-label">{organization.name}&#39;s project list</h3>
            <hr className="header-line" />
            <Row>
              {
                organization.projects.map((project) => {
                  return (
                    <Col md={6} key={`col${project.id}`}>
                      <ProjectCard key={project.id} project={project} />
                    </Col>
                  );
                })
              }
            </Row>
            {this.buttonType(organization.projects)}
          </div>
          : null
        }
      </DocumentTitle>
    );
  }
}

OrganizationHome.propTypes = {
  organization: PropTypes.object.isRequired,
  organizationActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    organizationActions: bindActionCreators(organizationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationHome);
