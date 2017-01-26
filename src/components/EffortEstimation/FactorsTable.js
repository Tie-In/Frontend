import {
  Table,
  Glyphicon,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import FactorRow from './FactorRow';

class FactorsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratings: [],
    };

    this.setRatings = this.setRatings.bind(this);
  }

  setRatings(index, rating) {
    const temp = this.state.ratings;
    temp[index] = rating;
    this.setState({ ratings: temp });
  }

  renderRows() {
    const rows = [];
    this.props.factors.map((data) => {
      rows.push(
        <FactorRow
          key={data.id} index={data.id - 1}
          name={data.name}
          weight={data.weight} returnImpact={this.setRatings}
        />,
      );
    });
    return rows;
  }

  computeResult() {
    let temp = 0;
    this.state.ratings.map((data) => {
      temp += parseFloat(data);
    });
    return temp;
  }

  render() {
    const { title, resultLabel } = this.props;
    const result = this.computeResult();
    const headerStyle = {
      backgroundColor: '#D0CBC7',
      color: 'white',
    };
    const resultStyle = {
      backgroundColor: '#F9F2E8',
      fontSize: '16px',
      height: '30px',
      width: '40%',
      paddingTop: '5px',
    };
    const iconStyle = {
      marginRight: '10px',
    };
    return (
      <div>
        <h4>{title}</h4>
        <Table responsive hover>
          <thead style={headerStyle}>
            <tr>
              <th className="text-center">Factor</th>
              <th className="text-center">Weight</th>
              <th className="text-center">Rating ( 0 - 5 )</th>
              <th className="text-center">Impact</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </Table>
        <div style={resultStyle}>
          <Glyphicon style={iconStyle} glyph="scale" />
          {resultLabel} = {result}
        </div>
      </div>
    );
  }
}

FactorsTable.propTypes = {
  title: PropTypes.string.isRequired,
  factors: PropTypes.arrayOf(PropTypes.object).isRequired,
  resultLabel: PropTypes.string.isRequired,
};

export default FactorsTable;
