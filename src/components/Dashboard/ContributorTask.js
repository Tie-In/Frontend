import React, { PropTypes, Component } from 'react';
import { Bar } from 'react-chartjs-2';

class ContributorTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      sprint: this.props.sprint,
    };
    this.getStatusNames = this.getStatusNames.bind(this);
    this.calUsersPoint = this.calUsersPoint.bind(this);
    this.genDataSet = this.genDataSet.bind(this);
  }

  async componentWillMount() {
    this.getStatusNames();
    this.genUserLable();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tasks: nextProps.tasks,
      sprint: nextProps.sprint,
    });
  }

  getStatusNames() {
    this.statusName = [];
    this.props.project.statuses.forEach((status) => {
      this.statusName.push(status.name);
    });
    // console.log(this.props.project.statuses);
  }

  genUserLable() {
    this.xLabels = [];
    this.usersIds = [];
    const contributors = this.props.project.project_contributes;
    contributors.forEach((contributor) => {
      this.xLabels.push(contributor.user.username);
      this.usersIds.push(contributor.user.id);
    });
    this.xLabels.push('Unknown');
    this.usersIds.push(null);
  }

  genDataSet() {
    this.dataSets = [];

    if (this.state.tasks.length > 0) {
      for (let i = 0; i < this.statusName.length; i += 1) {
        if (this.statusName[i] !== 'To do') {
          this.dataSets.push({
            label: this.statusName[i],
            data: this.calUsersPoint(this.statusName[i]),
            backgroundColor: this.props.colors[i],
            hoverBackgroundColor: this.props.colorsHover[i],
          });
        }
      }
    }
    return this.dataSets;
  }

  calUsersPoint(status) {
    const points = [];
    this.usersIds.forEach((id) => {
      let count = 0;
      this.state.tasks.forEach((task) => {
        // if (id === task.assignee_id && status === task.status.name) {
          count += task.story_point;
        // }
      });
      points.push(count);
    });
    // console.log(points);
    return points;
  }

  render() {
    // console.log(this.state.tasks);
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
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            // const tooltipLabel = data.labels[tooltipItem.index];
            const dataLabel = data.datasets[tooltipItem.datasetIndex].label;
            const tooltipData = allData[tooltipItem.index];
            return `${dataLabel} : ${tooltipData} ${tooltipData > 1 ? 'points' : 'point'}`;
          },
        },
        mode: 'label',
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
  sprint: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorsHover: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContributorTask;
