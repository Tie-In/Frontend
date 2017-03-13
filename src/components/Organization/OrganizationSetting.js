import React, { Component, PropTypes } from 'react';
import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl, Glyphicon,
  DropdownButton, MenuItem, Nav, NavItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import * as organizationActions from '../../actions/organization-actions';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';
import user1 from '../../images/user1.png';
import '../../style/autosuggestStyle.css';

class OrganizationSetting extends Component {
  constructor(props) {
    super(props);
    console.log(props.organization);
    this.state = {
      allUsers: [],
      input: {
        name: props.organization.name,
        description: props.organization.description,
        users: props.organization.user_organizations,
      },
      nameError: '',
      value: '',
      suggestions: [],
      contributors: [],
    };
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

  render() {
    const errorStyle = {
      color: '#d9534f',
      marginLeft: '25px',
    };
    const usersRow = (users) => {
      const contributorList = {
        height: '45px',
      };
      return users.map((user) => {
        return (
          <Row key={user.user.id} style={contributorList}>
            <Col xs={1}>
              <img
                id="avatar" role="presentation"
                src={user1}
              />
            </Col>
            <Col xs={3}>{user.user.username}</Col>
            <Col xs={3}>{user.user.email}</Col>
            <Col xs={3}>{user.permission_level}</Col>
            <Col xs={1}>
              <DropdownButton title={<Glyphicon glyph="cog" />}>
                <MenuItem eventKey="1">Change role</MenuItem>
                <MenuItem eventKey="2">Remove contributor</MenuItem>
              </DropdownButton>
            </Col>
          </Row>
        );
      });
    };

    return (
      <div>
        <Grid>
          <Form>
            {/* <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h3 className="header-label">Organization</h3>
                <hr className="header-line" />
                <FormGroup validationState={this.state.nameError === '' ? null : 'error'}>
                  <ControlLabel>
                    Organization&#39;s name
                  </ControlLabel>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                  <h6 style={errorStyle}>{this.state.nameError}</h6>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description (optional)
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of organization" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h4>
                  Contributors
                  <div className="pull-right">
                    <Button>Invite contributor</Button>
                  </div>
                </h4>
                <hr className="header-line" />
                {usersRow(this.props.organization.user_organizations)}
              </Col>
            </Row>
            <br />
            <Row>
              <FormGroup>
                <Col xs={4} xsOffset={4}>
                  <Button block>
                    Save
                  </Button>
                </Col>
              </FormGroup>
            </Row> */}
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <Nav bsStyle="tabs" activeKey={1} onSelect={this.handleSelect}>
                  <NavItem eventKey={1} href="/home">Information</NavItem>
                  <NavItem eventKey={2}>Contributors</NavItem>
                </Nav>
              </Col>
            </Row>
          </Form>
        </Grid>
      </div>
    );
  }
}

OrganizationSetting.propTypes = {
  organizationActions: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
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
