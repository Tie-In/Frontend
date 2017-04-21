import { Row, Col, Panel, Dropdown } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import ColorPicker from './ColorPicker';

class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      openDropdown: false,
      color: '',
    };
    this.selectColor = this.selectColor.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({ openDropdown: !this.state.openDropdown });
  }

  selectColor(colorHex) {
    console.log(`Color: ${colorHex}`);
    this.setState({ color: colorHex });
    console.log(`Color: ${this.state.color}`);
  }

  render() {
    const { comment } = this.props;
    const categoryColor = {
      backgroundColor: this.state.color,
    };
    return (
      <div>
        <Col sm={4}>
          <Panel>
            {comment}
            <Dropdown defaultOpen={this.openDropdown} dropup>
              <div bsRole="toggle">
                <button onClick={this.toggleDropdown} className="round-button" style={categoryColor} />
              </div>
              <div id="colorMenu" className="dropdown-menu" bsRole="menu">
                <ColorPicker setColor={this.selectColor} />
              </div>
            </Dropdown>
          </Panel>
        </Col>
      </div>
    );
  }
}
Category.propTypes = {
  comment: PropTypes.string.isRequired,
};

export default Category;
