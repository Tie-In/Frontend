import React, { Component, PropTypes } from 'react';
import { CirclePicker } from 'react-color';
import update from 'immutability-helper';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      colors: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ cats: nextProps.categories });
    this.state.cats.map((cat) => {
      this.setState({ colors: update(this.state.colors, { $push: [cat.color] }) });
    });
  }

  selectColor = (color) => {
    this.props.setColor(color.hex);
    this.props.toggle(false);
  }

  render() {
    return (
      <div>
        <CirclePicker
          colors={this.state.colors}
          onChangeComplete={this.selectColor}
        />
      </div>
    );
  }
}

ColorPicker.propTypes = {
  setColor: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ColorPicker;
