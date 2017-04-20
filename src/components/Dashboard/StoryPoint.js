import React, { PropTypes, Component } from 'react';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class StoryPoint extends Component {
  constructor(props) {
    super(props);
    // this.day = this.calAmountOfDay();
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
    return day + 1;
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
    for (let i = 0; i < this.calAmountOfDay(); i += 1) {
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
    const expectecData = [];
    const sprintDuration = this.props.project.sprint_duration * 7;
    const totalPoint = this.calTotalPoint();
    const gradient = totalPoint / sprintDuration;
    for (let i = 0; i < this.calAmountOfDay(); i += 1) {
      expectecData.push(totalPoint - (gradient * i));
    }
    return expectecData;
  }

  genActualData() {
    const actualData = [];
    let thisDate = this.startSprint();
    let remainingPoint = this.calTotalPoint();
    if (this.props.tasks[0]) {
      for (let i = 0; i < this.calAmountOfDay(); i += 1) {
        let countedPoint = 0;
        for (let j = 0; j < this.props.tasks.length; j += 1) {
          const doneDate = moment(this.props.tasks[j].done_date);
          if (doneDate.isSame(thisDate)) {
            countedPoint += 1;
          }
        }
        remainingPoint -= countedPoint;
        actualData.push(remainingPoint);
        thisDate = moment(thisDate).add(1, 'days');
      }
    }
    return actualData;
  }

  render() {
    const data1 = {
      labels: this.genXLable(),
      datasets: [{
        label: 'Expected',
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
        label: 'Actual',
        data: this.genActualData(),
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
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
    return (
      <div>
        <Line data={data1} options={options1} />
      </div>
    );
  }
}

StoryPoint.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  sprint: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

export default StoryPoint;
