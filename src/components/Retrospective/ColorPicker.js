import React, { Component, PropTypes } from 'react';
import { CirclePicker } from 'react-color';

class ColorPicker extends Component {
  selectColor = (color) => {
    this.props.setColor(color.hex);
  }

  render() {
    const colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC',
      '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];
    return (
      <div>
        <CirclePicker
          colors={colors}
          onChangeComplete={this.selectColor}
        />
      </div>
    );
  }
}

ColorPicker.propTypes = {
  setColor: PropTypes.func.isRequired,
};

export default ColorPicker;
