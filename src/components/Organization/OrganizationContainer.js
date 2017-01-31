import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Button, Row, Col } from 'react-bootstrap';
import ProjectCard from './ProjectCard';
import * as organizationActions from '../../actions/organization-actions';

class OrganizationContainer extends Component {

  componentWillMount() {
    axios({
      method: 'GET',
      url: '/api/organizations/'.concat(this.props.params.organizationId),
      headers: {
        Authorization: this.props.user.auth_token,
      },
    }).then((response) => {
      console.log(response);
      const org = response.data;
      this.props.organizationActions.setOrganization(org);
    }).catch((error) => {
      console.log(error);
    });
  }

  // checkHaveOrganization() {
  //   if (this.props.organization) {
  //     document.location.href = '/';
  //   }
  // }

  render() {
    const { user, organization } = this.props;
    return (
      <div>
        <Row>
          <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
            { organization.projects !== undefined ?
              organization.projects.map((project) => {
                return <ProjectCard key={project.id} project={project} />;
              }) : null
            }
            <Button href={`./${this.props.params.organizationId}/project-new`}>Create new project</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

OrganizationContainer.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  organizationActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    organization: state.organization,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    organizationActions: bindActionCreators(organizationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationContainer);
