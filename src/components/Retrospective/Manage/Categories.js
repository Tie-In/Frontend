import React, { Component, PropTypes } from 'react';
import update from 'immutability-helper';
import List from './List';
import Form from './Form';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      enter: 13,
      comma: 188,
      backspace: 8,
    };

    this.addCat = this.addCat.bind(this);
    this.editPrevCat = this.editPrevCat.bind(this);
  }

  addCat(category) {
    this.setState({ categories: update(this.state.categories, { $push: [category] }) });
  }

  editPrevCat() {
    const i = this.state.categories.length - 1;
    const lastCat = this.state.categories[i];
    this.setState({ categories: update(this.state.categories, { $splice: [[i, 1]] }) });
    return lastCat;
  }

  render() {
    return (
      <div className="form">
        <div className="tags">
          <List
            categories={this.state.categories}
            colors={this.props.colors}
          />
          <Form
            addCat={this.addCat}
            editPrevCat={this.editPrevCat}
            enter={this.state.enter}
            comma={this.state.comma}
            backspace={this.state.backspace}
          />
        </div>
        <small>Press <code>enter</code> or <code>,</code> to add a category.
        Press <code>backspace</code> to delete previous category.</small>
      </div>
    );
  }
}

Categories.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Categories;
