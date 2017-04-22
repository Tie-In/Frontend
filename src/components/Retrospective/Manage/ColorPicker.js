import React, { Component, PropTypes } from 'react';
import { CirclePicker } from 'react-color';

class ColorPicker extends Component {
  selectColor = (color) => {
    this.props.setColor(color.hex);
    this.props.toggle(false);
  }

  render() {
    return (
      <div>
        <CirclePicker
          colors={this.props.colors}
          onChangeComplete={this.selectColor}
        />
      </div>
    );
  }
}

ColorPicker.propTypes = {
  setColor: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ColorPicker;
