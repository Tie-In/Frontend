import { Row, Col, Panel, Dropdown } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import ColorPicker from './ColorPicker';

class Comment extends Component {

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

  toggleDropdown(open) {
    console.log('Toggle');
    console.log(`Before ${this.state.openDropdown}`);
    this.setState({ openDropdown: open });
    console.log(this.state.openDropdown);
  }

  selectColor(colorHex) {
    this.setState({ color: colorHex });
  }

  render() {
    console.log(`Render ${this.state.openDropdown}`);
    const { comment } = this.props;
    const categoryColor = {
      backgroundColor: this.state.color,
      // border: '0px',
    };
    return (
      <div>
        <Col sm={4}>
          <Panel>
            {comment}
            <Dropdown dropup>
              <div bsRole="toggle">
                <button onClick={() => { this.setState({ openDropdown: !this.state.openDropdown }); }} className="round-button" style={categoryColor} />
              </div>
              <div id="colorMenu" className="dropdown-menu" bsRole="menu">
                <ColorPicker setColor={this.selectColor} toggle={this.toggleDropdown} />
              </div>
            </Dropdown>
          </Panel>
        </Col>
      </div>
    );
  }
}
Comment.propTypes = {
  comment: PropTypes.string.isRequired,
};

export default Comment;
