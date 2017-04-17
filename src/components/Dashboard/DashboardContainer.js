import React, { Component, PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

class DashboardContainer extends Component {
  render() {
    // const data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [{
    //     label: 'Sales',
    //     type: 'line',
    //     data: [51, 65, 40, 49, 60, 37, 40],
    //     fill: false,
    //     borderColor: '#EC932F',
    //     backgroundColor: '#EC932F',
    //     pointBorderColor: '#EC932F',
    //     pointBackgroundColor: '#EC932F',
    //     pointHoverBackgroundColor: '#EC932F',
    //     pointHoverBorderColor: '#EC932F',
    //     yAxisID: 'y-axis-2',
    //   },
    //   {
    //     type: 'bar',
    //     label: 'Visitor',
    //     data: [200, 185, 590, 621, 250, 400, 95],
    //     fill: false,
    //     backgroundColor: '#71B37C',
    //     borderColor: '#71B37C',
    //     hoverBackgroundColor: '#71B37C',
    //     hoverBorderColor: '#71B37C',
    //     yAxisID: 'y-axis-1',
    //   }],
    // };
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90],
      }],
    };

    const options = {
      responsive: true,
      // bezierCurve: false,
      tooltips: {
        mode: 'label',
      },
      elements: {
        line: {
          // fill: false,
          tension: 0,
        },
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
          },
        ],
        yAxes: [
          {
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
          },
          // {
          //   type: 'linear',
          //   display: true,
          //   position: 'right',
          //   id: 'y-axis-2',
          //   gridLines: {
          //     display: false,
          //   },
          //   labels: {
          //     show: true,
          //   },
          // },
        ],
      },
    };
    return (
      // <div>
      //   <h1>Hello</h1>
      //   <Line data={data} options={options} />
      // </div>
      <div>
        <h2>Mixed data Example</h2>
        <Line
          data={data}
          options={options}
        />
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  params: PropTypes.object.isRequired,
};

export default DashboardContainer;
