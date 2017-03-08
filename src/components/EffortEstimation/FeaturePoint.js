import {
  Table,
  Glyphicon,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

class FeaturePoint extends Component {

  countComplexity(complexity) {
    let count = 0;
    this.props.features.map((feature) => {
      if (feature.complexity === complexity) {
        count += 1;
      }
    });
    return count;
  }

  render() {
    const { setValue } = this.props;
    const temp = {
      simple: this.countComplexity('simple'),
      medium: this.countComplexity('medium'),
      complex: this.countComplexity('complex'),
    };
    const product = {
      simple: 5 * temp.simple,
      medium: 10 * temp.medium,
      complex: 15 * temp.complex,
    };
    const resultStyle = {
      backgroundColor: '#F9F2E8',
      fontSize: '16px',
      height: '30px',
      width: '40%',
      paddingTop: '5px',
    };
    const headerStyle = {
      backgroundColor: '#D0CBC7',
      color: 'white',
    };
    const iconStyle = {
      marginRight: '10px',
      marginLeft: '10px',
    };
    const UUCP = product.simple + product.medium + product.complex;
    setValue('uucp', UUCP);
    return (
      <div>
        <h4>Calcuate UUCPs</h4>
        <Table responsive hover>
          <thead style={headerStyle}>
            <tr>
              <th className="text-center">Complexity</th>
              <th className="text-center">Number of features</th>
              <th className="text-center">Factor</th>
              <th className="text-center">Product</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Simple</td>
              <td className="text-center">{temp.simple}</td>
              <td className="text-center">5</td>
              <td className="text-center">{product.simple}</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td className="text-center">{temp.medium}</td>
              <td className="text-center">10</td>
              <td className="text-center">{product.medium}</td>
            </tr>
            <tr>
              <td>Complex</td>
              <td className="text-center">{temp.complex}</td>
              <td className="text-center">15</td>
              <td className="text-center">{product.complex}</td>
            </tr>
          </tbody>
        </Table>
        <div style={resultStyle}>
          <Glyphicon style={iconStyle} glyph="scale" />
          UUCP (unadjusted use case points) = {UUCP}
        </div>
      </div>
    );
  }
}

FeaturePoint.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  setValue: PropTypes.func.isRequired,
};

export default FeaturePoint;
