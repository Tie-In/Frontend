import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Table, Glyphicon, Button, FormGroup, FormControl, DropdownButton, MenuItem,
} from 'react-bootstrap';
import AddMemberRow from './AddMemberRow';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onEdit: -1,
      onCreate: false,
      newStatus: '',
      editStatus: '',
      editStatusIndex: '',
      deleteStatus: -1,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.del = this.del.bind(this);
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value
    });
  }

  create() {
    this.props.create(this.state.newStatus)
    this.setState({
      onCreate: false,
      newState: '',
    })
  }

  edit(status) {
    const pass = this.props.edit(status.id, this.state.editStatus, this.state.editStatusIndex - 1)
    if (pass) {
      this.setState({ onEdit: -1 });
    }
  }

  del(id) {
    this.props.del(id); 
    this.setState({ onDelete: -1 });
  }

  render() {
    const { statuses = [] } = this.props;
    const deleteRow = (id) => {
      return (
        <td>
          <Col xs={8} style={{ paddingTop: 7 }}>
            <span style={{ color: 'red' }}>Are you sure?</span> All tasks in this status will be move to the first status.
          </Col>
          <Col sm={4}>
            <div className="pull-right">
              <Button 
                bsStyle="primary" style={{ marginRight: 5}}
                onClick={() => { this.setState({ onDelete: -1 }); }}
              >
                Cancel
              </Button>
              <Button 
                bsStyle="primary"
                style={{ color: 'red' }}
                onClick={() => this.del(id)}
              >
                Delete status
              </Button>
            </div>
          </Col>
        </td>
      );
    };

    const editRow = (status, index) => {
      return (
        <td>
          <Col xs={1}>
            <FormControl 
              componentClass="select" name="editStatusIndex" 
              defaultValue={index + 1} 
              onChange={this.handleInputChange}
            >
              { statuses.map((_, i) => {
                return <option key={i} value={i + 1}>{i + 1}</option>
              })}
            </FormControl>
          </Col>
          <Col xs={5}>
            <FormControl
              type="text" placeholder="Status name"
              name="editStatus"
              value={this.state.editStatus}
              onChange={this.handleInputChange}
            />
          </Col>
          <Col sm={4} smOffset={2}>
            <div className="pull-right">
              <Button 
                bsStyle="primary" style={{ marginRight: 5}}
                onClick={() => { this.setState({ onEdit: -1 }); }}
              >
                Cancel
              </Button>
              <Button onClick={() => this.edit(status)}>
                Save change
              </Button>
            </div>
          </Col>
        </td>
      );
    };

    const normalRow = (status, index) => { 
      return (
        <td style={{ verticalAlign: 'middle' }}>
          <Col xs={1}>{index + 1}</Col>
          { index + 1 !== statuses.length ? 
            <Col xs={8}>{status.name}</Col>
            :
            <div>
              <Col xs={3}>{status.name}</Col>
              <Col xs={5} style={{ color: 'grey' }}>
                  * Task in this status will marked as done
              </Col>
            </div>
          }
          <Col xs={3} style={{ textAlign: 'center' }}>
            <a 
              style={{ cursor: 'pointer', marginRight: 20 }} 
              onClick={() => this.setState({ onEdit: index, editStatus: status.name })}
            >
              <Glyphicon glyph="pencil" /> Edit
            </a>
            <a 
              style={{ cursor: 'pointer' }} onClick={() => this.setState({ onDelete: index})}
            >
              <Glyphicon glyph="remove" /> Delete
            </a>
          </Col> 
        </td>
      );
    };

    return (
      <div>
        <Row>
          <Col xs={12}>
            <Table bordered condensed hover>
              <thead>
                <tr style={{ height: 40 }}>
                  <th style={{ verticalAlign: 'middle' }}>Status List </th>
                </tr>
              </thead>
              <tbody>
                { statuses.map((status, index) => {
                  return (<tr key={status.id} style={{ height: 45 }}>
                      { this.state.onEdit === index ? 
                        editRow(status, index)
                        :
                        this.state.onDelete === index ?
                          deleteRow(status.id)
                          :
                          normalRow(status, index)
                      }
                  </tr>);
                })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        { this.state.onCreate ? 
          <Row>
            <Col xs={8}>
              <FormGroup controlId="formInlineDetail">
                <FormControl
                  type="text" placeholder="Status name"
                  name="newStatus"
                  value={this.state.newStatus}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={3}>
              <Button 
                bsStyle="primary" style={{ marginRight: 5 }}
                onClick={() => { this.setState({ onCreate: false }); }}
              >
                Cancel
              </Button>
              <Button onClick={() => this.create()}>
                Create status
              </Button>
            </Col>
          </Row>
          :
          <Row>
            <Col xs={12} md={8} mdOffset={4}>
              <Button
                className="pull-right" onClick={() => { this.setState({ onCreate: true }); }}
              >
                New status
              </Button>
            </Col>
          </Row>
        }
      </div>
    );
  }
}

TaskStatus.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  create: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  del: PropTypes.func.isRequired,
};

export default TaskStatus;
