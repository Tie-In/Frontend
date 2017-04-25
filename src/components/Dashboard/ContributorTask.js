import React, { PropTypes, Component } from 'react';
import { Bar } from 'react-chartjs-2';

class ContributorTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      // sprint: this.props.sprint,
    };
    // this.getStatusNames = this.getStatusNames.bind(this);
    this.calUsersPoint = this.calUsersPoint.bind(this);
    this.genDataSet = this.genDataSet.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tasks: nextProps.tasks,
      // sprint: nextProps.sprint,
    });
  }

  // getStatusNames() {
  //   // console.log(this.props.statuses);
  //   const statusName = [];
  //   this.props.statuses.forEach((status) => {
  //     statusName.push(status.name);
  //   });
  //   return statusName;
  // }

  genUserLable() {
    const xLabels = [];
    this.usersIds = [];
    const contributors = this.props.project.project_contributes;
    contributors.forEach((contributor) => {
      xLabels.push(contributor.user.username);
      this.usersIds.push(contributor.user.id);
    });
    xLabels.push('Unknown');
    this.usersIds.push(null);
    return xLabels;
  }

  calUsersPoint(status) {
    console.log(status);
    const points = [];
    const { sprint, tasks } = this.props;

    this.usersIds.forEach((id) => {
      let count = 0;
      if (status !== -1) {
        tasks.forEach((task) => {
          if (id === task.assignee_id && status.id === task.status_id) {
            count += task.story_point;
          }
        });
      } else {
        sprint.tasks.forEach((task) => {
          if (id === task.assignee_id) {
            count += task.story_point;
          }
        });
      }
      points.push(count);
    });
    console.log(points);
    return points;
  }

  genDataSet() {
    this.dataSets = [];
    const { statuses, sprint, project } = this.props;
    if (this.state.tasks.length > 0) {
      if (sprint.id === project.current_sprint_id) {
        for (let i = 0; i < statuses.length; i += 1) {
          if (statuses[i].name !== 'To do') {
            this.dataSets.push({
              label: statuses[i].name,
              data: this.calUsersPoint(statuses[i]),
              backgroundColor: this.props.colors[i],
              hoverBackgroundColor: this.props.colorsHover[i],
            });
          }
        }
      } else {
        this.dataSets.push({
          label: 'Done',
          data: this.calUsersPoint(-1),
          backgroundColor: this.props.colors[0],
          hoverBackgroundColor: this.props.colorsHover[0],
        });
      }
    }
    return this.dataSets;
  }

  render() {
    const barData = {
      labels: this.genUserLable(),
      datasets: this.genDataSet(),
    };
    const options = {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
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
