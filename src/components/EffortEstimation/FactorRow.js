import {
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import linkState from 'react-link-state';

class FactorRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: '',
    };
    this.updateRating = this.updateRating.bind(this);
  }

  updateRating(e) {
    this.setState({ rating: e.target.value });
    const value = e.target.value * this.props.weight;
    this.props.returnImpact(this.props.index, e.target.value, value);
  }

  render() {
    const { name, weight } = this.props;
    const tooltip = (<Tooltip id="tooltip"><strong>Holy guacamole!</strong> Check this info.</Tooltip>);
    const factorStyle = {
      marginLeft: '10px',
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
            type="number" min="0" max="5"
            onChange={this.updateRating}
          />
        </td>
        <td className="text-center">{impact}</td>
      </tr>
    );
  }
}

FactorRow.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  returnImpact: PropTypes.func.isRequired,
};

export default FactorRow;
