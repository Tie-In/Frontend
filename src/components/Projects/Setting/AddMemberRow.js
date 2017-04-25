import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Modal, Button, Glyphicon,
} from 'react-bootstrap';
import AutosuggestionBlock from '../../shared/AutosuggestionBlock';
import * as apiHelper from '../../../helpers/apiHelper';

class AddMemberRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      allUsers: [],
      selectedUserId: '',
    };

    this.close = this.close.bind(this);
    this.setSelectedUser = this.setSelectedUser.bind(this);
    this.addMember = this.addMember.bind(this);
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get('/api/users', {
        organization: this.props.organization_id,
      });
      const users = response.data;
      this.setState({ allUsers: users });
    } catch (err) {
      console.log(err);
    }
  }

  setSelectedUser(id) {
    this.setState({ selectedUserId: id });
  }

  async addMember() {
    try {
      await apiHelper.post('/api/project_contributes', {
        project_contribute: {
          user_id: this.state.selectedUserId,
          project_id: this.props.project_id,
        },
      });
      this.close();
      this.props.update();
    } catch (err) {
      console.log(err);
    }
  }

  close() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const { showModal } = this.state;
    return (
      <div>
        <Row>
          <Col xs={12} md={8} mdOffset={4}>
            <Button
              className="pull-right"
              onClick={() => { this.setState({ showModal: !showModal }); }}
            >
              <Glyphicon glyph="plus" /> Add member
            </Button>
          </Col>
        </Row>
        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              Select member
              <hr />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AutosuggestionBlock data={this.state.allUsers} setValue={this.setSelectedUser} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addMember}>Add member</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

AddMemberRow.propTypes = {
  project_id: PropTypes.number.isRequired,
  organization_id: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
};

export default AddMemberRow;
