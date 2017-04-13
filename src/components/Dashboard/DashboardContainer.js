import React, { Component, PropTypes } from 'react';
import { Bar } from 'react-chartjs-2';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

class DashboardContainer extends Component {
  render() {
    const data = {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      datasets: [
        {
          type: 'bar',
          label: 'Bar Component',
          data: [10, 20, 30],
        },
        {
          type: 'line',
          label: 'Line Component',
          data: [30, 20, 10],
          borderColor: '#F85F73',
        },
      ],
    };
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: 'true',
            // max: 5,
            // min: 0,
            // stepSize: 0.5,
          },
        }],
      },
    };
    return (
      <div>
        <h1>Hello</h1>
        <Bar data={data} options={options} />
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  params: PropTypes.object.isRequired,
};

export default DashboardContainer;
