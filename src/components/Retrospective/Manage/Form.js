import React, { Component, PropTypes } from 'react';
import update from 'immutability-helper';
import { FormControl } from 'react-bootstrap';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      enter: this.props.enter,
      comma: this.props.comma,
      backspace: this.props.backspace,
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleKeyUp(e) {
    const key = e.keyCode;
    if (key === this.state.enter || key === this.state.comma) {
      this.addCat();
    }
  }

  handleKeyDown(e) {
    const key = e.keyCode;
    if (key === this.state.backspace && this.state.input === '') {
      this.editPrevCat();
    }
  }

  handleInputChange(e) {
    this.setState({ input: update(this.state.input, { $set: e.target.value }) });
  }

  addCat() {
    const cat = this.state.input.trim().replace(/,/g, '');
    if (!cat) {
      return;
    }
    this.props.addCat(cat);
    this.setState({ input: '' });
  }

  editPrevCat() {
    const cat = this.props.editPrevCat();
    if (!cat) {
      return;
    }
    this.setState({ input: cat });
  }

  render() {
    return (
      <FormControl
        type="text"
        placeholder="Add category..."
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
        value={this.state.input}
        onChange={this.handleInputChange}
      />
    );
  }
}

Form.propTypes = {
  enter: PropTypes.number.isRequired,
  comma: PropTypes.number.isRequired,
  backspace: PropTypes.number.isRequired,
  addCat: PropTypes.func.isRequired,
  editPrevCat: PropTypes.func.isRequired,
};

export default Form;
