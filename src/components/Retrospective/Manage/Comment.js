import { Col, Panel, Dropdown } from 'react-bootstrap';
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
    this.setState({ openDropdown: open });
  }

  selectColor(colorHex) {
    this.setState({ color: colorHex });
    this.props.setComment(colorHex, this.props.commentID);
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
            <Dropdown className="pull-right" dropup>
              <div bsRole="toggle">
                <button
                  onClick={() => { this.setState({ openDropdown: !this.state.openDropdown }, () => {
                    console.log(this.state.openDropdown);
                  }); }}
                  className="round-button" style={categoryColor}
                />
              </div>
              <div id="colorMenu" className="dropdown-menu" bsRole="menu">
                { this.state.openDropdown ?
                  <ColorPicker
                    setColor={this.selectColor}
                    toggle={this.toggleDropdown}
                    categories={this.props.categories}
                  /> : <div />
                }
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
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  setComment: PropTypes.func.isRequired,
  commentID: PropTypes.number.isRequired,
};

export default Comment;
