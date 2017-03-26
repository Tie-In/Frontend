import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Table, DropdownButton,
  MenuItem, Glyphicon, Modal, Button,
} from 'react-bootstrap';

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
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  close() {
    this.setState({ showModal: !this.state.showModal });
  }

  openChangeRole(member) {
    this.setState({
      showModal: true,
      selectedMember: member,
      selectedUser: member.user,
      selectedRole: member.permission_level,
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

  render() {
    const { members = [] } = this.props;
    const roles = ['owner', 'admin', 'user'];

    return (
      <div>
        <Row>
          <Col xs={12} md={8} mdOffset={2}>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Member</th>
                </tr>
              </thead>
              <tbody>
                { members.map((member) => {
                  return (<tr>
                    <td>
                      <Col xs={4}>{member.user.username}</Col>
                      <Col xs={4}>{member.permission_level}</Col>
                      <Col xs={2}>
                        <DropdownButton title={<Glyphicon glyph="cog" />}>
                          <MenuItem eventKey="1" onClick={() => { this.openChangeRole(member); }}>Change role</MenuItem>
                          <MenuItem eventKey="2">Remove from organization</MenuItem>
                        </DropdownButton>
                      </Col>
                    </td>
                  </tr>);
                })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        <div>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>
                Change {this.state.selectedUser.username} permission level?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                {
                  roles.map((role) => {
                    return (
                      <div>
                        <label>
                          <input
                            type="radio" value={role}
                            checked={this.state.selectedRole === role}
                            onChange={this.handleRoleChange}
                          />
                          <span style={{ marginLeft: 5 }}>
                            {role}
                          </span>
                        </label>
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
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateRole: PropTypes.func.isRequired,
};

export default Member;
