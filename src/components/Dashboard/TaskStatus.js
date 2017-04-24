import React, { PropTypes, Component } from 'react';
import { Pie } from 'react-chartjs-2';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
    };
  }

  async componentWillMount() {
    this.getStatusNames();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tasks: nextProps.tasks });
  }

  getStatusNames() {
    this.statusName = [];
    this.props.project.statuses.forEach((status) => {
      this.statusName.push(status.name);
    });
  }

  getNumberOfTasks() {
    const numbers = [];
    this.statusName.forEach((status) => {
      let count = 0;
      this.state.tasks.forEach((task) => {
        if (task.status.name === status) {
          count += 1;
        }
      });
      numbers.push(count);
    });
    return numbers;
  }

  render() {
    const pieData = {
      labels: this.statusName,
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
  project: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorsHover: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TaskStatus;
