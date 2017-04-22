import React, { Component, PropTypes } from 'react';
import Category from './Category';

class List extends Component {
  render() {
    const { colors, categories } = this.props;
    const list = categories.map((category, index) => {
      return (
        <Category
          key={index}
          category={category}
          color={colors[index]}
        />
      );
    });
    return (
      <div>{list}</div>
    );
  }
}

List.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default List;
