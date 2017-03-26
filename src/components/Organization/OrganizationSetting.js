import React, { Component, PropTypes } from 'react';
import {
  Grid, Col, Row, Form,
  Nav, NavItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as organizationActions from '../../actions/organization-actions';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import Information from './Setting/Information';
import Member from './Setting/Member';
import '../../style/autosuggestStyle.css';

class OrganizationSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.updateSetting = this.updateSetting.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
    this.updateOrganization = this.updateOrganization.bind(this);
  }

  updateSetting(data) {
    try {
      apiHelper.put(`/api/organizations/${this.props.organization.id}`, {
        organization: data,
      });

      this.updateOrganization();
    } catch (err) {
      console.log(err);
    }
  }

  updateUserRole(id, role) {
    try {
      apiHelper.put(`/api/user_organizations/${id}`, {
        user_organization: {
          permission_level: role,
        },
      });
      this.updateOrganization();
    } catch (err) {
      console.log(err);
    }
  }

  async updateOrganization() {
    try {
      const updateResponse = await apiHelper.get(`/api/organizations/${this.props.organization.id}`);
      const org = updateResponse.data;
      this.props.organizationActions.setOrganization(org);
    } catch (err) {
      console.log(err);
    }
  }

  handleSelect(eventKey) {
    this.setState({ tabIndex: eventKey });
  }

  render() {
    const { tabIndex } = this.state;
    const { organization } = this.props;
    const switchRender = (tab) => {
      if (tab === 1) {
        return (<Information organization={organization} update={this.updateSetting} />);
      } else if (tab === 2) {
        return (
          <Member members={organization.user_organizations} updateRole={this.updateUserRole} />
        );
      }
      return <div />;
    };

    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <Nav bsStyle="tabs" activeKey={tabIndex} onSelect={this.handleSelect}>
                  <NavItem eventKey={1}>Information</NavItem>
                  <NavItem eventKey={2}>Contributors</NavItem>
                </Nav>
              </Col>
            </Row>
            <br />
            {switchRender(tabIndex)}
          </Form>
        </Grid>
      </div>
    );
  }
}

OrganizationSetting.propTypes = {
  organizationActions: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
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
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSetting);
