import React, { Component, PropTypes } from 'react';
import {
  Col, Row, Table, Glyphicon, Button, FormGroup, FormControl, Label, Dropdown,
} from 'react-bootstrap';
import { CirclePicker } from 'react-color';

class TagManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onEdit: -1,
      onCreate: false,
      newTagName: '',
      newTagColor: '#f44336',
      editTagName: '',
      editTagColor: '',
      deleteTag: -1,
      openDropdownCreate: false,
      openDropdownEdit: false,
    };

    this.defaultColor = '#f44336';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.del = this.del.bind(this);
    this.toggleDropdownCreate = this.toggleDropdownCreate.bind(this);
    this.toggleDropdownEdit = this.toggleDropdownEdit.bind(this);
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value,
    });
  }

  create() {
    this.props.create(this.state.newTagName, this.state.newTagColor);
    this.setState({
      onCreate: false,
      newTagColor: this.defaultColor,
      newTagName: '',
    });
  }

  edit(tag) {
    const pass = this.props.edit(tag.id, this.state.editTagName, this.state.editTagColor);
    if (pass) {
      this.setState({ onEdit: -1 });
    }
  }

  del(id) {
    this.props.del(id); 
    this.setState({ onDelete: -1 });
  }

  toggleDropdownCreate() {
    this.setState({ openDropdownCreate: !this.state.openDropdownCreate });
  }

  toggleDropdownEdit() {
    this.setState({ openDropdownEdit: !this.state.openDropdownEdit });
  }

  render() {
    const { tags = [] } = this.props;
    const menuStyle = {
      padding: '5px 5px 5px 5px',
    };
    const deleteRow = (id) => {
      return (
        <td>
          <Col xs={8} style={{ paddingTop: 7 }}>
            <span style={{ color: 'red' }}>Are you sure?</span> It will be removed from all tasks.
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
                onClick={() => { this.del(id); }}
              >
                Delete status
              </Button>
            </div>
          </Col>
        </td>
      );
    };

    const editRow = (tag) => {
      return (
        <td>
          <Col xs={5}>
            <FormControl
              type="text" placeholder="Tag name"
              name="editTagName"
              value={this.state.editTagName}
              onChange={this.handleInputChange}
            />
          </Col>
          <Col xs={3}>
            <Dropdown id="tagsDropdown" open={this.state.openDropdownEdit}>
              <div bsRole="toggle">
                <Button
                  onClick={this.toggleDropdownEdit}
                  style={{ color: this.state.editTagColor }}
                  bsStyle="primary"
                >
                  <div
                    style={{ backgroundColor: this.state.editTagColor, width: 15, height: 15, display: 'inline-block' }} 
                  /> {this.state.editTagColor}
                </Button>
              </div>
              <div className="dropdown-menu" style={menuStyle} bsRole="menu">
                <CirclePicker
                  onChangeComplete={(color) => {
                    this.setState({ editTagColor: color.hex, openDropdownEdit: false });
                  }}
                />
              </div>
            </Dropdown>
          </Col>
          <Col sm={4}>
            <div className="pull-right">
              <Button
                bsStyle="primary" style={{ marginRight: 5 }}
                onClick={() => { this.setState({ onEdit: -1 }); }}
              >
                Cancel
              </Button>
              <Button onClick={() => { this.edit(tag); }}>
                Save change
              </Button>
            </div>
          </Col>
        </td>
      );
    };

    const normalRow = (tag, index) => {
      return (
        <td style={{ verticalAlign: 'middle' }}>
          <Col xs={9}>
            <h4 style={{ margin: 0 }}>
              <Label style={{ backgroundColor: tag.color }}>{tag.name}</Label>
            </h4>
          </Col>
          <Col xs={3} style={{ textAlign: 'center' }}>
            <a
              style={{ cursor: 'pointer', marginRight: 20 }} 
              onClick={() => this.setState({ onEdit: index, editTagName: tag.name, editTagColor: tag.color })}
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
                  <th style={{ verticalAlign: 'middle' }}>Tag List </th>
                </tr>
              </thead>
              <tbody>
                { tags.map((tag, index) => {
                  return (<tr key={tag.id} style={{ height: 45 }}>
                      { this.state.onEdit === index ?
                        editRow(tag, index)
                        :
                        this.state.onDelete === index ?
                          deleteRow(tag.id)
                          :
                          normalRow(tag, index)
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
            <Col xs={6}>
              <FormGroup controlId="formInlineDetail">
                <FormControl
                  type="text" placeholder="Tag name"
                  name="newTagName"
                  value={this.state.newTagName}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={3}>
            <Dropdown id="tagsDropdown" open={this.state.openDropdownCreate}>
              <div bsRole="toggle">
                <Button
                  onClick={this.toggleDropdownCreate}
                  style={{ color: this.state.newTagColor }}
                  bsStyle="primary"
                >
                  <div
                    style={{
                      backgroundColor: this.state.newTagColor,
                      width: 15,
                      height: 15,
                      display: 'inline-block',
                    }}
                  /> {this.state.newTagColor}
                </Button>
              </div>
              <div className="dropdown-menu" style={menuStyle} bsRole="menu">
                <CirclePicker
                  onChangeComplete={(color) => {
                    this.setState({ newTagColor: color.hex, openDropdownCreate: false });
                  }}
                />
              </div>
            </Dropdown>
            </Col>
            <Col xs={3}>
              <Button
                bsStyle="primary" style={{ marginRight: 5 }}
                onClick={() => {
                  this.setState({ onCreate: false, newTagColor: this.defaultColor });
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => { this.create(); }}>
                Create tag
              </Button>
            </Col>
          </Row>
          :
          <Row>
            <Col xs={12} md={8} mdOffset={4}>
              <Button
                className="pull-right" onClick={() => { this.setState({ onCreate: true }); }}
              >
                New tag
              </Button>
            </Col>
          </Row>
        }
      </div>
    );
  }
}

TagManage.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  create: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  del: PropTypes.func.isRequired,
};

export default TagManage;
