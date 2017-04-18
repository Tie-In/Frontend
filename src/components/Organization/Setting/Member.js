import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Table, DropdownButton,
  MenuItem, Glyphicon, Modal, Button,
} from 'react-bootstrap';
import AddMemberRow from './AddMemberRow';

class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedMember: {},
      selectedUser: {},
      selectedRole: '',
    };

    this.close = this.close.bind(this);
    this.openChangeRole = this.openChangeRole.bind(this);
    this.openDeleteMember = this.openDeleteMember.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
  }

  close() {
    this.setState({ showModal: !this.state.showModal });
  }

  openChangeRole(member) {
    this.setState({
      showModal: true,
      modalType: 'role',
      selectedMember: member,
      selectedUser: member.user,
      selectedRole: member.permission_level,
    });
  }

  openDeleteMember(member) {
    this.setState({
      showModal: true,
      modalType: 'delete',
      selectedMember: member,
      selectedUser: member.user,
    });
  }

  handleRoleChange(e) {
    this.setState({
      selectedRole: e.target.value,
    });
  }

  submit() {
    this.props.updateRole(this.state.selectedMember.id, this.state.selectedRole);
    this.setState({ showModal: !this.state.showModal });
  }

  delete() {
    this.props.deleteMember(this.state.selectedMember.id);
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const { members = [], permission } = this.props;
    const { showModal, selectedUser, selectedRole, modalType } = this.state;
    const roles = ['owner', 'admin', 'user'];
    const modalContent = (type) => {
      if (type === 'role') {
        return (
          <Modal show={showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>
                Change {selectedUser.username} permission level?
                <hr />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                {
                  roles.map((role, index) => {
                    return (
                      <div key={index}>
                        <input
                          type="radio" value={role}
                          checked={selectedRole === role}
                          onChange={this.handleRoleChange}
                        />
                        <span style={{ marginLeft: 5 }}>
                          {role}
                        </span>
                        <br />
                      </div>
                    );
                  })
                }
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.submit}>Change role</Button>
            </Modal.Footer>
          </Modal>
        );
      } else if (type === 'delete') {
        return (
          <Modal show={showModal} onHide={this.close} bsSize="small" aria-labelledby="contained-modal-title-sm">
            <Modal.Header closeButton>
              <Modal.Title>
                Remove {selectedUser.username} from organization?
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button onClick={this.delete}>Remove</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      return <div />;
    };

    return (
      <div>
        <Row>
          <Col xs={12}>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Member</th>
                </tr>
              </thead>
              <tbody>
                { members.map((member) => {
                  return (<tr key={member.id}>
                    <td>
                      <Col xs={2}>
                        <img
                          id="avatar" role="presentation"
                          src={member.user.image}
                        />
                      </Col>
                      <Col xs={3} style={{ paddingTop: 5 }}>{member.user.username}</Col>
                      <Col xs={3} style={{ paddingTop: 5 }}>{member.permission_level}</Col>
                      { permission !== 'user' ?
                        <Col xsOffset={3} xs={1}>
                          <DropdownButton id="organizationSettingDropdown" title={<Glyphicon glyph="cog" />}>
                            <MenuItem eventKey="1" onClick={() => { this.openChangeRole(member); }}>
                              Change role
                            </MenuItem>
                            <MenuItem eventKey="2" onClick={() => { this.openDeleteMember(member); }}>
                              Remove from organization
                            </MenuItem>
                          </DropdownButton>
                        </Col> : <div />
                      }
                    </td>
                  </tr>);
                })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        {modalContent(modalType)}
        { permission !== 'user' ?
          <AddMemberRow organization_id={this.props.organization.id} update={this.props.update} /> : <div />
        }
      </div>
    );
  }
}

Member.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateRole: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  permission: PropTypes.string.isRequired,
};

export default Member;
