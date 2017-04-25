import React, { PropTypes, Component } from 'react';
import { Pie } from 'react-chartjs-2';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      sprint: this.props.sprint,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks });
  }

  getStatusNames() {
    const { sprint, project, statuses } = this.props;
    const statusName = [];
    if (sprint.id === project.current_sprint_id) {
      statuses.forEach((status) => {
        statusName.push(status.name);
      });
    } else if (sprint.tasks) {
      statusName.push('Done');
      statusName.push('Postpone');
    }
    return statusName;
  }

  getNumberOfTasks() {
    const numbers = [];
    const { sprint, project, statuses } = this.props;
    if (sprint.id === project.current_sprint_id) {
      statuses.forEach((status) => {
        numbers.push(status.tasks.length);
      });
    } else if (sprint.tasks) {
      numbers.push(sprint.done_count);
      numbers.push(sprint.postpone_count);
    }
    return numbers;
  }

  render() {
    const pieData = {
      labels: this.getStatusNames(),
      datasets: [{
        data: this.getNumberOfTasks(),
        backgroundColor: this.props.colors,
        hoverBackgroundColor: this.props.colorsHover,
      }],
    };
    const options = {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipLabel = data.labels[tooltipItem.index];
            const tooltipData = allData[tooltipItem.index];
            return `${tooltipLabel} : ${tooltipData} ${tooltipData > 1 ? 'tasks' : 'task'}`;
          },
        },
      },
    };

    return (
      <div>
        <Pie data={pieData} options={options} />
      </div>
    );
  }
}

TaskStatus.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  sprint: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorsHover: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TaskStatus;
