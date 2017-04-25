import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Form,
  Nav, NavItem, Glyphicon,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';
import Information from './Setting/Information';
import Member from './Setting/Member';
import TaskStatus from './Setting/TaskStatus';
import TagManage from './Setting/TagManage';
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
    this.createStatus = this.createStatus.bind(this);
    this.editStatus = this.editStatus.bind(this);
    this.deleteStatus = this.deleteStatus.bind(this);
    this.createTag = this.createTag.bind(this);
    this.editTag = this.editTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
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

  async createStatus(statusName) {
    const { project } = this.props;
    try {
      await apiHelper.post('/api/statuses', {
        status: {
          project_id: project.id,
          name: statusName,
          column_index: project.statuses.length,
        },
      });
      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async editStatus(id, statusName, index) {
    try {
      await apiHelper.put(`/api/statuses/${id}`, {
        status: {
          name: statusName,
          column_index: index,
        },
      });
      this.updateProject();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async deleteStatus(id) {
    console.log(id);
    try {
      await apiHelper.del(`/api/statuses/${id}`);
      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async createTag(tagName, tagColor) {
    const { project } = this.props;
    try {
      await apiHelper.post('/api/tags', {
        tag: {
          project_id: project.id,
          name: tagName,
          color: tagColor,
        },
      });
      this.updateProject();
    } catch (err) {
      console.log(err);
    }
  }

  async editTag(id, tagName, tagColor) {
    try {
      await apiHelper.put(`/api/tags/${id}`, {
        tag: {
          name: tagName,
          color: tagColor,
        },
      });
      this.updateProject();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async deleteTag(id) {
    console.log(id);
    try {
      await apiHelper.del(`/api/tags/${id}`);
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
    const { project, permission } = this.props;
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
            permission={permission.project}
          />
        );
      } else if (tab === 3) {
        return (
          <TaskStatus
            statuses={project.statuses} create={this.createStatus}
            edit={this.editStatus} del={this.deleteStatus}
            permission={permission.project}
          />
        );
      } else if (tab === 4) {
        return (
          <TagManage
            tags={project.tags} create={this.createTag}
            edit={this.editTag} del={this.deleteTag}
          />
        );
      }
      return <div />;
    };

    return (
      <DocumentTitle title={`${project.name}・Setting`}>
        <div className="tiein-container">
          <h3 className="header-label">Project setting</h3>
          <hr className="header-line" />
          <Form>
            <Row>
              <Col xs={12}>
                <Nav className="setting-tabs" bsStyle="tabs" activeKey={tabIndex} onSelect={this.handleSelect}>
                  <NavItem eventKey={1}><Glyphicon glyph="info-sign" /> Information</NavItem>
                  <NavItem eventKey={2}><Glyphicon glyph="user" /> Contributors</NavItem>
                  <NavItem eventKey={3}><Glyphicon glyph="th-list" /> Task status</NavItem>
                  <NavItem eventKey={4}><Glyphicon glyph="tags" /> Tags</NavItem>
                </Nav>
              </Col>
            </Row>
            <br />
            {switchRender(tabIndex)}
          </Form>
        </div>
      </DocumentTitle>
    );
  }
}

ProjectSetting.propTypes = {
  projectActions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  permission: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    permission: state.permission,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetting);
