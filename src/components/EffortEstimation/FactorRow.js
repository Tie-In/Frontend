import {
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

class FactorRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: '',
    };
    this.updateRating = this.updateRating.bind(this);
    this.checkValue = this.checkValue.bind(this);
  }

  updateRating(e) {
    this.setState({ rating: e.target.value });
    const value = e.target.value * this.props.weight;
    this.props.returnImpact(this.props.index, e.target.value, value);
  }

  checkValue() {
    const { rating } = this.state;

    if (rating > 5) {
      this.setState({ rating: 5 });
    } else if (rating < 0) {
      this.setState({ rating: 0 });
    }
  }

  render() {
    const { name, weight, description } = this.props;
    const tooltip = <Tooltip id="tooltip">{description}</Tooltip>;
    const factorStyle = {
      marginLeft: '10px',
    };
    const inputStyle = {
      width: '50px',
    };
    const impact = weight * this.state.rating;
    return (
      <tr>
        <td>
          {name}
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Glyphicon style={factorStyle} glyph="info-sign" />
          </OverlayTrigger>
        </td>
        <td className="text-center">{weight}</td>
        <td className="text-center">
          <input
            id="inputRating"
            type="number" min="0" max="5"
            style={inputStyle}
            onChange={this.updateRating}
            value={this.state.rating}
            onBlur={() => { this.checkValue(); }}
          />
        </td>
        <td
          className="text-center"
        >{impact}</td>
      </tr>
    );
  }
}

FactorRow.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  returnImpact: PropTypes.func.isRequired,
};

export default FactorRow;
