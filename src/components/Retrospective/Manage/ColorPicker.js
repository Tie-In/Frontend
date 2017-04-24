import React, { Component, PropTypes } from 'react';
import { CirclePicker } from 'react-color';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: this.props.categories,
      colors: [],
    };
  }

  componentWillMount() {
    this.setState({ colors: this.props.categories.map((category) => {
      return category.color;
    }) });
  }

  selectColor = (color) => {
    this.props.setColor(color.hex);
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
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ColorPicker;
