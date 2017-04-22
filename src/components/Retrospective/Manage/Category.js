import React, { Component, PropTypes } from 'react';

class Category extends Component {
  render() {
    return (
      <li key={this.props.key} className="tag">{this.props.category}</li>
    );
  }
}

Category.propTypes = {
  key: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
};

export default Category;
