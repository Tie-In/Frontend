import React, { Component, PropTypes } from 'react';
import {
  Grid, Col, Row, Form,
  Nav, NavItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as organizationActions from '../../actions/organization-actions';
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
    this.updateMemberRole = this.updateMemberRole.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
    this.updateOrganization = this.updateOrganization.bind(this);
  }

  async updateSetting(data) {
    try {
      await apiHelper.put(`/api/organizations/${this.props.organization.id}`, {
        organization: data,
      });

      this.updateOrganization();
    } catch (err) {
      console.log(err);
    }
  }

  async updateMemberRole(id, role) {
    try {
      await apiHelper.put(`/api/user_organizations/${id}`, {
        user_organization: {
          permission_level: role,
        },
      });
      this.updateOrganization();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteMember(id) {
    try {
      await apiHelper.del(`/api/user_organizations/${id}`);
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
    const { organization, permission } = this.props;
    console.log(permission);
    const switchRender = (tab) => {
      if (tab === 1) {
        return (<Information organization={organization} update={this.updateSetting} />);
      } else if (tab === 2) {
        return (
          <Member
            members={organization.user_organizations}
            updateRole={this.updateMemberRole}
            deleteMember={this.deleteMember}
            organization={organization}
            update={this.updateOrganization}
            permission={permission.organization}
          />
        );
      }
      return <div />;
    };

    return (
      <div className="tiein-container">
        <h3 className="header-label">Organization setting</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <Col xs={12}>
              <Nav bsStyle="tabs" activeKey={tabIndex} onSelect={this.handleSelect}>
                <NavItem eventKey={1}>Information</NavItem>
                <NavItem eventKey={2}>Contributors</NavItem>
              </Nav>
            </Col>
          </Row>
          <br />
          {switchRender(tabIndex)}
        </form>
      </div>
    );
  }
}

OrganizationSetting.propTypes = {
  organizationActions: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  permission: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    permission: state.permission,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    organizationActions: bindActionCreators(organizationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSetting);
