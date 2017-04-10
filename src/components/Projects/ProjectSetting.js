import React, { Component, PropTypes } from 'react';
import {
  Grid, Col, Row, Form,
  Nav, NavItem,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';
import Information from './Setting/Information';
import Member from './Setting/Member';
import '../../style/autosuggestStyle.css';

class ProjectSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 1,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.updateSetting = this.updateSetting.bind(this);
    this.updateMemberRole = this.updateMemberRole.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  async updateSetting(data) {
    try {
      await apiHelper.put(`/api/projects/${this.props.project.id}`, {
        project: data,
      });

      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async updateMemberRole(id, role) {
    try {
      await apiHelper.put(`/api/project_contributes/${id}`, {
        project_contribute: {
          permission_level: role,
        },
      });
      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteMember(id) {
    try {
      await apiHelper.del(`/api/project_contributes/${id}`);
      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async updateProject() {
    try {
      const updateResponse = await apiHelper.get(`/api/projects/${this.props.project.id}`);
      const project = updateResponse.data;
      this.props.projectActions.setProject(project);
    } catch (err) {
      console.log(err);
    }
  }

  handleSelect(eventKey) {
    this.setState({ tabIndex: eventKey });
  }

  render() {
    const { tabIndex } = this.state;
    const { project } = this.props;
    const switchRender = (tab) => {
      if (tab === 1) {
        return (<Information project={project} update={this.updateSetting} />);
      } else if (tab === 2) {
        return (
          <Member
            members={project.project_contributes}
            updateRole={this.updateMemberRole}
            deleteMember={this.deleteMember}
            project={project}
            update={this.updateProject}
          />
        );
      }
      return <div />;
    };

    return (
      <div className="tiein-container">
        <h3 className="header-label">Project setting</h3>
        <hr className="header-line" />
        <Form>
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
        </Form>
      </div>
    );
  }
}

ProjectSetting.propTypes = {
  projectActions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetting);
