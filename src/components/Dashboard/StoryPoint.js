import React, { PropTypes, Component } from 'react';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class StoryPoint extends Component {
  constructor(props) {
    super(props);
    this.day = this.calAmountOfDay();
    // this.genXLable = this.genXLable.bind(this);
    // this.calAmountOfDay = this.calAmountOfDay.bind(this);
    // this.calTotalPoint = this.calTotalPoint.bind(this);
  }

  startSprint() {
    return this.convertToLocalDate(this.props.sprint.start_date);
  }

  endSprint() {
    return this.convertToLocalDate(this.props.sprint.end_date);
  }

  calAmountOfDay() {
    const start = moment(this.startSprint()).dayOfYear();
    let day = 0;
    if (!moment(this.endSprint()).isValid()) {
      const today = moment().dayOfYear();
      day = today - start;
    } else {
      const end = moment(this.endSprint()).dayOfYear();
      day = end - start;
    }
    return day;
  }

  convertToLocalDate(serverDate) {
    if (serverDate === null) {
      return '-';
    }
    const date = moment.utc(serverDate).local();
    return `${moment(date).get('year')}/${moment(date).get('month') + 1}/${moment(date).get('date')}`;
  }

  genXLable() {
    const labels = [];
    console.log(this.day);
    for (let i = 0; i < this.day; i += 1) {
    // for (let i = 0; i < 5; i += 1) {
      const newDate = moment(this.startSprint()).add(i, 'days');
      labels.push(this.convertToLocalDate(newDate));
    }
    return labels;
  }

  calTotalPoint() {
    let point = 0;
    if (this.props.tasks[0]) {
      for (let i = 0; i < this.props.tasks.length; i += 1) {
        point += this.props.tasks[i].story_point;
      }
    }
    return point;
  }

  genExpectedData() {
    // console.log(this.state.numberOfDay);
    return [this.calTotalPoint(), 65, 40, 49, 60, 37, 0];
  }

  render() {
    // console.log(this.props.tasks);
    // console.log(this.props.sprint);
    const data1 = {
      labels: this.genXLable(),
      datasets: [{
        label: 'Sales',
        type: 'line',
        data: this.genExpectedData(),
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
