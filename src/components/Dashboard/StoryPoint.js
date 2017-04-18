import React, { PropTypes, Component } from 'react';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class StoryPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      sprint: this.props.sprint,
    };
    this.getDateSet = this.getDateSet.bind(this);
    this.startDate = this.getLocalDate(this.state.sprint.start_date);
    this.endDate = this.getLocalDate(this.state.sprint.end_date);
  }

  getDateSet() {
    // const start = moment(this.state.startDate).dayOfYear();
    // const end = moment(this.state.endDate).dayOfYear();
    // let day = end - start;
    const labels = [];
    if (!moment(this.endDate).isValid()) {
      // const today = moment().dayOfYear();
      // day = today - start;
    }
    for (let i = 0; i < 5; i += 1) {
      const newDate = moment(this.startDate).add(i, 'days');
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
    const data1 = {
      labels: this.getDateSet(),
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
