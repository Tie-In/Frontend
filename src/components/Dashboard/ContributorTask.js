import React, { PropTypes, Component } from 'react';
import { Bar } from 'react-chartjs-2';
import randomColor from 'randomcolor';

class ContributorTask extends Component {
  async componentWillMount() {
    this.getStatusNames();
    this.genUserLable();
  }

  getStatusNames() {
    this.statusName = [];
    this.props.project.statuses.forEach((status) => {
      this.statusName.push(status.name);
    });
  }

  genUserLable() {
    this.xLabels = [];
    this.usersIds = [];
    const contributors = this.props.project.project_contributes;
    contributors.forEach((contributor) => {
      this.xLabels.push(contributor.user.username);
      this.usersIds.push(contributor.user.id);
    });
  }

  genDataSet() {
    this.dataSets = [];
    this.statusName.forEach((status) => {
      if (status !== 'To do') {
        const color = randomColor({
          hue: 'red',
          format: 'rgb',
          luminosity: 'light', // light, bright, dark
        });
        console.log(color);
        this.dataSets.push({
          label: status,
          data: this.calUsersPoint(status),
          // backgroundColor: color,
          // borderColor: 'rgba(255,99,132,1)',
          // borderWidth: 1,
          // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          // hoverBorderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
        });
      }
    });
    return this.dataSets;
  }

  calUsersPoint(status) {
    const points = [];
    this.usersIds.forEach((id) => {
      let count = 0;
      this.props.tasks.forEach((task) => {
        if (id === task.assignee_id && status === task.status.name) {
          count += task.story_point;
        }
      });
      points.push(count);
    });
    console.log(points);
    return points;
  }

  render() {
    console.log(this.props.tasks);
    const barData = {
      labels: this.xLabels,
      datasets: this.genDataSet(),
      // datasets: [
      //   {
      //     label: 'Done',
      //     data: this.calUsersPoint(),
      //     backgroundColor: 'rgba(255,99,132,0.2)',
      //     borderColor: 'rgba(255,99,132,1)',
      //     borderWidth: 1,
      //     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      //     hoverBorderColor: 'rgba(255,99,132,1)',
      //   },
      //   {
      //     label: 'Doing',
      //     data: [15, 19, 3, 5, 2, 3],
      //     backgroundColor: 'rgba(255, 159, 64, 0.2)',
      //     borderColor: 'rgba(255, 159, 64, 1)',
      //     borderWidth: 1,
      //   },
      // ],
    };
    const options = {
      tooltips: {
        callbacks: {
          // label: (tooltipItem, data) => {
          //   // const allData = data.datasets[tooltipItem.datasetIndex].data;
          //   // const tooltipLabel = data.labels[tooltipItem.index];
          //   // const tooltipData = allData[tooltipItem.index];
          //   // let total = 0;
          //   // for (let i in allData) {
          //   //   if (Object.prototype.hasOwnProperty.call(allData, i)) {
          //   //     total += allData[i];
          //   //   }
          //   // }
          //   // const tooltipPercentage = Math.round((tooltipData / total) * 100);
          //   // return `${tooltipLabel} : tooltipData (${tooltipPercentage} %)`;
          // },
        },
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
          beginAtZero: true,
        }],
      },
    };

    return (
      <div>
        <Bar data={barData} options={options} />
      </div>
    );
  }
}

ContributorTask.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  project: PropTypes.object.isRequired,
};

export default ContributorTask;
