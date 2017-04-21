import React, { PropTypes, Component } from 'react';
import { Pie } from 'react-chartjs-2';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusName: [],
    };
    this.getStatusNames = this.getStatusNames.bind(this);
    this.getNumberOfTasks = this.getNumberOfTasks.bind(this);
  }

  async componentWillMount() {
    this.getStatusNames();
  }

  getStatusNames() {
    const data = [];
    this.props.project.statuses.forEach((status) => {
      data.push(status.name);
    });
    this.setState({
      statusName: data,
    });
  }

  getNumberOfTasks() {
    const numbers = [];
    const tasks = this.props.tasks;
    // console.log(tasks);
    this.state.statusName.forEach((status) => {
      let count = 0;
      tasks.forEach((task) => {

        console.log(task.status.name);
        console.log(status);
      });
      console.log('=========');
      numbers.push(count);
    });
    // console.log(tasks);
    return [300, 50, 100];
  }

  render() {
    const pieData = {
      labels: this.state.statusName,
      datasets: [{
        data: this.getNumberOfTasks(),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }],
    };

    return (
      <div>
        <Pie data={pieData} />
      </div>
    );
  }
}

TaskStatus.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  project: PropTypes.object.isRequired,
};

export default TaskStatus;
