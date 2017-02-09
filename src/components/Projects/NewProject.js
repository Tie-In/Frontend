import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl,
  InputGroup, Glyphicon, Media, Image,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import logo from '../../images/logo-login.png';
import * as projectActions from '../../actions/project-actions';

class NewProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        name: '',
        description: '',
        sprint_duration: '',
        users: [
          {
            id: 2,
          },
        ],
        organization_id: this.props.params.organizationId,
      },
    };

    this.create = this.create.bind(this);
  }

  create() {
    axios({
      method: 'POST',
      url: '/api/projects',
      headers: {
        Authorization: this.props.user.auth_token,
      },
      data: {
        project: this.state.input,
      },
    }).then((response) => {
      console.log(response);
      const project = response.data;
      this.props.projectActions.setProject(project);
      document.location.href = `/organizations/${project.organization_id}/projects/${project.id}`;
    }).catch((error) => {
      console.log(error);
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

    };
    const scrollableContainer = {
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
                <h3 style={titleColor}>Create new project</h3>
                <hr style={lineColor} />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Project&#39;s name
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
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Sprint duration
                  </ControlLabel>
                  <FormControl type="number" min="0" placeholder="Sprint duration (week)" valueLink={linkState(this, 'input.sprint_duration')} />
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
                      valueLink={linkState(this, 'input.u')}
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
                        <Image width={32} height={32} src={logo} alt="user" circle />
                      </Media.Left>
                      <Media.Body>
                        <p>pongsachon.p@ku.th</p>
                      </Media.Body>
                    </Media>
                    <Media>
                      <Media.Left>
                        <Image width={32} height={32} src={logo} alt="user" circle />
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

NewProject.propTypes = {
  user: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
