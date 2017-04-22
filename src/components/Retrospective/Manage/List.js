import React, { Component, PropTypes } from 'react';
import Category from './Category';

class List extends Component {
  render() {
    const categories = this.props.categories.map((category) => {
      return <Category key={this.props.categories.indexOf(category)} category={category} />;
    });
    return (
      <ul>{categories}</ul>
    );
  }
}

List.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default List;
