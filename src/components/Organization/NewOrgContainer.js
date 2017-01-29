import React, { Component, PropTypes } from 'react';
import { Button, Grid, Col, Row, Form, FormGroup, ControlLabel, FormControl, InputGroup, Glyphicon, Media, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import * as organizationActions from '../../actions/organization-actions';

class NewOrgContainer extends Component {
  constructor() {
    super();

    this.state = {
      input: {
        name: '',
        description: '',
        users: [
          {
            id: 2,
          },
        ],
      },
    };

    this.create = this.create.bind(this);
  }

  create() {
    axios({
      method: 'POST',
      url: '/api/organizations',
      headers: {
        Authorization: this.props.user.auth_token,
      },
      data: {
        organization: this.state.input,
      },
    }).then((response) => {
      const org = response.data;
      this.props.actions.setOrganization(org);
      document.location.href = `/organizations/${org.id}`;
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  render() {
    const lineColor = {
      borderColor: '#7E8281',
    };
    const titleColor = {
      color: '#A25E5D',
    };
    const buttonGroup = {
      marginTop: '20px',
    };
    const singleButton = {
      marginTop: '10px',
    };
    const contributorList = {
      height: '200px',
      position: 'relative',
      // backgroundColor: 'pink',

    };
    const scrollableContainer = {
      // borderLeft: 'solid 1px',
      borderLeft: '1px solid #7E8281',
      position: 'absolute',
      height: '85%',
      width: 'auto',
      overflowY: 'hidden',
      overflowX: 'hidden',
    };

    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <h3 style={titleColor}>Create new organization</h3>
                <hr style={lineColor} />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Organization&#39;s name
                  </ControlLabel>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of organization" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineContributor">
                  <ControlLabel>
                    Contributor
                  </ControlLabel>
                  <InputGroup>
                    <FormControl
                      placeholder="Find user"
                      valueLink={linkState(this, 'input.duration')}
                    />
                    <InputGroup.Addon>
                      <Glyphicon glyph="plus" />
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col style={contributorList} xs={12} md={4}>
                <ControlLabel style={{ color: 'white' }}>
                  List of contributors
                </ControlLabel>
                <Row style={scrollableContainer}>
                  <Col smOffset={0} sm={11}>
                    <Media>
                      <Media.Left>
                        <Image width={32} height={32} src="src/images/logo-login.png" alt="user" circle />
                      </Media.Left>
                      <Media.Body>
                        <p>pongsachon.p@ku.th</p>
                      </Media.Body>
                    </Media>
                    <Media>
                      <Media.Left>
                        <Image width={32} height={32} src="src/images/logo-login.png" alt="user" circle />
                      </Media.Left>
                      <Media.Body>
                        <p>pongsachon.p@ku.th</p>
                      </Media.Body>
                    </Media>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <FormGroup style={buttonGroup}>
                <Col xs={12} md={3} xsOffset={0} mdOffset={3}>
                  <Button style={singleButton} bsStyle="primary" href="/no-organization" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button style={singleButton} onClick={this.create} block>
                    Create
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </Form>
        </Grid>
      </div>
    );
  }
}

NewOrgContainer.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(organizationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgContainer);
