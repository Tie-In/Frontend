import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl,
  InputGroup, Glyphicon, Label,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';

class NewTask extends Component {

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

  async create() {
    try {
      const response = await apiHelper.post('/api/projects', {
        project: this.state.input,
      });
      const project = response.data;
      this.props.projectActions.setProject(project);
      document.location.href = `/organizations/${project.organization_id}/projects/${project.id}`;
    } catch (err) {
      console.log(err);
    }
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
    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <h3 style={titleColor}>Create new task</h3>
                <hr style={lineColor} />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Task&#39;s name
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
                  <FormControl type="text" placeholder="Description" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineContributor">
                  <ControlLabel>
                    Feature
                  </ControlLabel>
                  <InputGroup>
                    <FormControl
                      placeholder="Select feature"
                      valueLink={linkState(this, 'input.u')}
                    />
                    <InputGroup.Addon>
                      <Glyphicon glyph="menu-down" />
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={12} md={4} xsOffset={0}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Assignee (Optional)
                  </ControlLabel>
                  <FormControl type="text" placeholder="Find user" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineContributor">
                  <ControlLabel>
                    Tags
                  </ControlLabel>
                  <InputGroup>
                    <FormControl
                      placeholder="Define tags"
                      valueLink={linkState(this, 'input.u')}
                    />
                    <InputGroup.Addon>
                      <Glyphicon glyph="plus" />
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={12} md={4}>
                <Row style={{ paddingTop: 20 }}>
                  <Col smOffset={0} sm={11}>
                    <h4>
                      <Label bsStyle="success">Issue</Label>
                    </h4>
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

NewTask.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);
