import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ProjectCard from './ProjectCard';
import * as organizationActions from '../../actions/organization-actions';

class OrganizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org: '',
    };
  }

  componentDidMount() {
    axios({
      method: 'GET',
      url: '/api/organizations/'.concat(this.props.params.organizationId),
      headers: {
        Authorization: this.props.user.auth_token,
      },
    }).then((response) => {
      const org = response.data;
      this.props.organizationActions.setOrganization(org);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const articleStyles = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };
    const { user, organization } = this.props;
    console.log(organization);
    return (
      <div style={articleStyles}>
        {
          organization.projects.map((project) => {
            <h2>Have</h2>
          })
        }
        <Button href={`./${this.props.params.organizationId}/project-new`}>Create new project</Button>
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
