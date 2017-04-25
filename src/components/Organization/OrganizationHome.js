import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Image, Glyphicon } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ProjectCard from './ProjectCard';
import * as organizationActions from '../../actions/organization-actions';
import * as permissionActions from '../../actions/permission-actions';
import AddProject from '../../images/newproject.png';
import * as apiHelper from '../../helpers/apiHelper';

class OrganizationHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async componentWillMount() {
    const { params, user } = this.props;
    try {
      const response = await apiHelper.get(`/api/organizations/${params.organizationId}`);
      const org = response.data;
      this.props.organizationActions.setOrganization(org);
      const perLevel = org.user_organizations.find((x) => {
        return x.user_id === user.id;
      }).permission_level;
      this.props.permissionActions.setOrganization(perLevel);
      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
   
      localStorage.clear();
      document.location.href = '/login';
    }
  }

  buttonType(projects) {
    const newProjectPath = `./${this.props.organization.id}/projects/new`;
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
        <Glyphicon glyph="plus" /> Create new project
      </Button>);
    }
    return (
      <div style={articleStyles} href={newProjectPath}>
        <a>
          <Image src={AddProject} alt="Image" />
        </a>
        <br />
        <Button href={newProjectPath} style={buttonDefaultStyle}>
          <Glyphicon glyph="plus" /> Create new project
        </Button>
      </div>
    );
  }

  render() {
    const { organization, user } = this.props;
    const filterProject = () => {
      return organization.projects.filter((project) => {
        return project.users.find((u) => { return u.id === user.id; });
      });
    };

    return (
      this.state.loading ? <div /> :
      <DocumentTitle title={organization.name}>
        <div className="tiein-container">
          <h3 className="header-label">{organization.name}&#39;s project list</h3>
          <hr className="header-line" />
          <Row>
            {
              filterProject().map((project) => {
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
      </DocumentTitle>
    );
  }
}

OrganizationHome.propTypes = {
  organization: PropTypes.object.isRequired,
  permissionActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    organizationActions: bindActionCreators(organizationActions, dispatch),
    permissionActions: bindActionCreators(permissionActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationHome);
