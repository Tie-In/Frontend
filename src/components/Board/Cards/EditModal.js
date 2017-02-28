import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';

class EditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.setShow(false);
  }

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit task</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>
            {/* <Button onClick={this.close}>Close</Button> */}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

EditModal.propTypes = {
  item: PropTypes.object.isRequired,
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default EditModal;
