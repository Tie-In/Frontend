import React, { Component, PropTypes } from 'react';
import {
  Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl, Nav, NavItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as organizationActions from '../../actions/organization-actions';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import Information from './Setting/Information';
import '../../style/autosuggestStyle.css';

class OrganizationSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.updateSetting = this.updateSetting.bind(this);
  }

  async componentWillMount() {
    // try {
    //   const response = await apiHelper.get('/api/users');
    //   const users = response.data;
    //   this.setState({ allUsers: users });
    // } catch (err) {
    //   console.log(err);
    // }
  }

  async updateSetting(data) {
    try {
      const response = await apiHelper.put(`/api/organizations/${this.props.organization.id}`, {
        organization: data,
      });
      const org = response.data;
      this.props.organizationActions.setOrganization(org);
      console.log(org);
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
