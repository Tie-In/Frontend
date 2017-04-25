import React, { PropTypes, Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class StoryPoint extends Component {
  startSprint() {
    return this.convertToLocalDate(this.props.sprint.start_date);
  }

  endSprint() {
    return this.convertToLocalDate(this.props.sprint.end_date);
  }

  calAmountOfDay() {
    const start = moment(this.startSprint()).dayOfYear();
    let day = 0;
    if (!this.props.sprint.is_ended) {
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
    const day = this.calAmountOfDay();
    for (let i = 0; i < day; i += 1) {
    // for (let i = 0; i < 5; i += 1) {
      const newDate = moment(this.startSprint()).add(i, 'days');
      labels.push(this.convertToLocalDate(newDate));
    }
    if (day === 1) {
      labels.splice(0, 0, '');
    }
    return labels;
  }

  genExpectedData() {
    const expectecData = [];
    const sprintDuration = this.props.project.sprint_duration * 7;
    const totalPoint = this.props.sprint.sprint_points;
    const gradient = totalPoint / sprintDuration;
    const day = this.calAmountOfDay();
    for (let i = 0; i < day; i += 1) {
      expectecData.push(Math.round(totalPoint - (gradient * i)));
    }
    if (day === 1) {
      expectecData.splice(0, 0, totalPoint);
    }
    return expectecData;
  }

  genActualData() {
    const actualData = [];
    let thisDate = this.startSprint();
    let remainingPoint = this.props.sprint.sprint_points;
    const day = this.calAmountOfDay();

    // console.log(this.props.statuses);
    // const done = this.props.statuses.find((status) => { return status.name === 'Done'; });

    if (this.props.tasks[0]) {
      for (let i = 0; i < day; i += 1) {
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
    if (day === 1) {
      actualData.splice(0, 0, actualData[0]);
    }
    return actualData;
  }

  render() {
    // console.log(this.props.sprint);
    const data1 = {
      labels: this.genXLable(),
      datasets: [{
        type: 'line',
        label: 'Actual',
        data: this.genActualData(),
        fill: false,
        backgroundColor: this.props.colors[1],
        hoverBackgroundColor: this.props.colorsHover[1],
        borderColor: this.props.colors[1],
        hoverBorderColor: this.props.colorsHover[1],
        pointBorderColor: this.props.colors[1],
        pointBackgroundColor: this.props.colors[1],
        pointHoverBackgroundColor: this.props.colorsHover[1],
        pointHoverBorderColor: this.props.colorsHover[1],
        yAxisID: 'y-axis-1',
        steppedLine: true,
      },
      {
        label: 'Expected',
        type: 'line',
        data: this.genExpectedData(),
        fill: false,
        backgroundColor: this.props.colors[8],
        hoverBackgroundColor: this.props.colorsHover[8],
        borderColor: this.props.colors[8],
        hoverBorderColor: this.props.colorsHover[8],
        pointBorderColor: this.props.colors[8],
        pointBackgroundColor: this.props.colors[8],
        pointHoverBackgroundColor: this.props.colorsHover[8],
        pointHoverBorderColor: this.props.colorsHover[8],
        yAxisID: 'y-axis-1',
      }],
    };
    const options1 = {
      responsive: true,
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
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Day in sprint',
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
            scaleLabel: {
              display: true,
              labelString: 'Remaining point',
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
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  sprint: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorsHover: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StoryPoint;
