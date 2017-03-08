import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Image } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ProjectCard from './ProjectCard';
import * as organizationActions from '../../actions/organization-actions';
import AddProject from '../../images/newproject.png';
import * as apiHelper from '../../helpers/apiHelper';

class OrganizationContainer extends Component {

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
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    const buttonDefaultStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
    };
    const pStyle = {
      margin: '0 0 0',
    };
    if (projects.length > 0) {
      return (<Button href={newProjectPath}>
        Create new project
      </Button>);
    }
    return (
      <div style={articleStyles} href={newProjectPath}>
        <a href="/organizations/new">
          <Image src={AddProject} alt="Image" />
        </a>
        <p style={pStyle} />
        <Button href={newProjectPath} style={buttonDefaultStyle}>Create new project</Button>
      </div>
    );
  }

  render() {
    const { organization } = this.props;

    return (
      <DocumentTitle title={organization.name}>
        <div>
          { organization.projects !== undefined ?
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                {
                  organization.projects.map((project) => {
                    return <ProjectCard key={project.id} project={project} />;
                  })
                }
                {this.buttonType(organization.projects)}
              </Col>
            </Row>
            : null
          }
        </div>
      </DocumentTitle>
    );
  }
}

OrganizationContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationContainer);
