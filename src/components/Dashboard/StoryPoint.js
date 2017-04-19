import React, { PropTypes, Component } from 'react';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class StoryPoint extends Component {
  constructor(props) {
    super(props);
    this.getXLable = this.getXLable.bind(this);
  }
  // tasks = this.props.tasks;
  // sprint = this.props.sprint;

  getXLable() {
    const labels = [];
    // const td = this.getLocalDate(moment());
    const startDate = this.getLocalDate(this.props.sprint.start_date);
    const endDate = this.getLocalDate(this.props.sprint.end_date);
    const start = moment(startDate).dayOfYear();
    let day = 0;
    if (!moment(endDate).isValid()) {
      const today = moment().dayOfYear();
      day = today - start;
    } else {
      const end = moment(endDate).dayOfYear();
      day = end - start;
    }
    for (let i = 0; i < day; i += 1) {
    // for (let i = 0; i < 5; i += 1) {
      const newDate = moment(startDate).add(i, 'days');
      labels.push(this.getLocalDate(newDate));
    }
    return labels;
  }

  getLocalDate(serverDate) {
    if (serverDate === null) {
      return '-';
    }
    const date = moment.utc(serverDate).local();
    return `${moment(date).get('year')}/${moment(date).get('month') + 1}/${moment(date).get('date')}`;
  }

  render() {
    console.log(this.props.tasks);
    console.log(this.props.sprint);
    const data1 = {
      labels: this.getXLable(),
      datasets: [{
        label: 'Sales',
        type: 'line',
        data: [51, 65, 40, 49, 60, 37, 40],
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-1',
      },
      {
        type: 'line',
        label: 'Visitor',
        data: [200, 185, 590, 621, 250, 400, 95],
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1',
      }],
    };
    const options1 = {
      // responsive: true,
      tooltips: {
        mode: 'label',
      },
      elements: {
        line: {
          fill: false,
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
        ],
      },
    };
    return (
      <div>
        <h4><FaBarChart /> Burndown Chart</h4>
        <Line data={data1} options={options1} />
      </div>
    );
  }
}

StoryPoint.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  sprint: PropTypes.object.isRequired,
};

export default StoryPoint;
