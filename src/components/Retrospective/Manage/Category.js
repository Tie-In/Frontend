import React, { Component, PropTypes } from 'react';

class Category extends Component {
  render() {
    const categoryColor = {
      backgroundColor: this.props.color,
    };
    return (
      <li className="tag" style={categoryColor}>{this.props.category}</li>
    );
  }
}

Category.propTypes = {
  category: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Category;
