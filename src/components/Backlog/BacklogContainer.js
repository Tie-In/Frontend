import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import 'simple-line-icons/css/simple-line-icons.css';
import Style from '../../style/backlog.css';

class BacklogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      status: '',
    };
  }

  render() {
    let close = () => this.setState({ show: false });
    const data = [
      { id: 1, name: 'task wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdftask wealgmlew;sdf' },
      { id: 2, name: 'wf;l,pqwlkgp[wpoekgasfsafAsf]' },
      { id: 3, name: 'fsegeryweoprpqwol;f,p[aqf]' },
      { id: 4, name: 'eswtweoitowpktiuq0[ro]' },
      { id: 5, name: 'wetawkeipotiwpoeltkkoww sprint' },
      { id: 6, name: 'ewrwrp3oprlokdg,ld' },
      { id: 7, name: 'ssdger[prkewjfk]' },
      { id: 8, name: 'wrw3twqr' },
    ];
    const backlogTaskNode = data.map((task) => {
      return (
        <Row>
          <li key={task.id} id="task">
            <Col xs={10} md={11}><span id="taskName" onClick={() => this.setState({ show: true })}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-plus" role="button" id="addButton" /></Col>
          </li>
        </Row>
      );
    });
    const sprintTaskNode = data.map((task) => {
      return (
        <Row>
          <li key={task.id} id="task">
            <Col xs={10} md={10}>
              <span id="taskName" onClick={() => this.setState({ show: true })}>{task.name}</span></Col>
            <Col xs={1} md={1}><span className="icon-close" role="button" id="addButton" /></Col>
          </li>
        </Row>
      );
    });
    return (
      <div className="backlogContainer" style={Style}>
        <Row>
          <Col sm={8}>
            <h4>Backlog</h4>
            <hr />
            <ul className="backlog" id="tasklist">{backlogTaskNode}</ul>
          </Col>
          <Col sm={4}>
            <h4>This sprint: </h4>
            <hr />
            <ul className="sprint" id="tasklist">{sprintTaskNode}</ul>
          </Col>
        </Row>
        <div className="modal-container">
          <Modal
            show={this.state.show}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Elit est explicabo .
              wqfklm;lwEM
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>


    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(BacklogContainer);
