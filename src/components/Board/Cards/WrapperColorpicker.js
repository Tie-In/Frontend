import React, { Component, PropTypes } from 'react';
import { CirclePicker } from 'react-color';

class WrapperColorpicker extends Component {
  selectColor = (color) => {
    this.props.setColor(color.hex);
  }

  render() {
    return (
      <div>
        <CirclePicker onChangeComplete={this.selectColor} />
      </div>
    );
  }
}

export default WrapperColorpicker;
