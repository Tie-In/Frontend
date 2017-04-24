import { Col, Panel, Dropdown } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import ColorPicker from './ColorPicker';
import * as apiHelper from '../../../helpers/apiHelper';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      openDropdown: false,
      color: '',
      tempCategories: [],
    };

    this.selectColor = this.selectColor.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.findID = this.findID.bind(this);
    this.setCat = this.setCat.bind(this);
  }

  async setCat() {
    try {
      const res = await apiHelper.get('/api/viewpoint_categories', {
        retrospective: this.props.sprint.retrospective.id,
      });
      this.setState({ tempCategories: res.data });
      console.log(this.state.tempCategories);
    } catch (err) {
      console.log(err);
    }

    const id = this.findID();
    if (id !== -1) {
      try {
        const res = await apiHelper.put(`/api/viewpoints/${this.props.commentID}`, {
          viewpoint: {
            viewpoint_category_id: id,
          },
        });
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  findID() {
    let id = -1;
    let catName = '';
    this.props.categories.forEach((cat) => {
      if (cat.color.trim().toLowerCase() === this.state.color.trim().toLowerCase()) {
        catName = cat.name;
      }
    });
    this.state.tempCategories.forEach((cat) => {
      if (cat.name === catName) {
        id = cat.id;
      }
    });
    return id;
  }

  toggleDropdown(open) {
    this.setState({ openDropdown: open });
  }

  selectColor(colorHex) {
    this.setState({ color: colorHex });
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
                  onClick={() => { this.setState({ openDropdown: !this.state.openDropdown }); }}
                  className="round-button" style={categoryColor}
                />
              </div>
              <div id="colorMenu" className="dropdown-menu" bsRole="menu">
                { this.state.openDropdown ?
                  <ColorPicker
                    setColor={this.selectColor}
                    toggle={this.toggleDropdown}
                    categories={this.props.categories}
                    setCat={this.setCat}
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
  commentID: PropTypes.number.isRequired,
  sprint: PropTypes.object.isRequired,
};

export default Comment;
