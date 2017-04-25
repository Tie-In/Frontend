import React, { PropTypes, Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

class RemainingTasks extends Component {
  // startSprint() {
  //   return this.convertToLocalDate(this.props.sprint.start_date);
  // }
  //
  // endSprint() {
  //   return this.convertToLocalDate(this.props.sprint.end_date);
  // }

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

  // convertToLocalDate(serverDate) {
  //   if (serverDate === null) {
  //     return '-';
  //   }
  //   const date = moment.utc(serverDate).local();
  //   return `${moment(date).get('year')}/${moment(date).get('month') + 1}/${moment(date).get('date')}`;
  // }

  genActualData() {
    const { project, totalTasks } = this.props;
    const actualData = [totalTasks.length];
    let remainingTask = totalTasks.length;
    const amountSprint = project.sprints.length;

    if (remainingTask > 0) {
      for (let i = 0; i < amountSprint; i += 1) {
        let doneTask = 0;
        for (let j = 0; j < remainingTask; j += 1) {
          const startSprint = project.sprints[i].start_date;
          const endSprint = project.sprints[i].end_date;
          // console.log(`sprint ${i} : ${startSprint} - ${endSprint}`);
          if (totalTasks[j].is_done) {
            const doneDate = moment(totalTasks[j].done_date);
            if (moment(doneDate).isBetween(startSprint, endSprint, null, '[]')) {
              doneTask += 1;
            }
          }
        }
        remainingTask -= doneTask;
        actualData.push(remainingTask);
      }
    }
    if (amountSprint === 1) {
      actualData.splice(0, 0, actualData[0]);
    }
    return actualData;
  }

  genXLable() {
    const labels = [0];
    const { project } = this.props;
    const amountSprint = project.sprints.length;
    for (let i = 0; i < amountSprint; i += 1) {
      labels.push(i + 1);
    }
    if (amountSprint === 1) {
      labels.splice(0, 0, '');
    }

    return labels;
  }

  genExpectedData() {
    const expectecData = [];
    const { project, totalTasks } = this.props;
    const totalweek = project.effort_estimation.lower_weeks;
    const duration = project.sprint_duration;
    const estimatedSprint = totalweek / duration;
    const gradient = totalTasks.length / estimatedSprint;
    const amountSprint = project.sprints.length;

    for (let i = 0; i < amountSprint; i += 1) {
      expectecData.push(Math.round(totalTasks.length - (gradient * i)));
    }
    if (amountSprint === 1) {
      expectecData.splice(0, 0, totalTasks.length);
    }
    return expectecData;
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
              labelString: 'Sprint',
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
              labelString: 'Remaining tasks',
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

RemainingTasks.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  sprint: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorsHover: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RemainingTasks;
