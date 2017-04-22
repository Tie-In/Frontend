import React, { PropTypes, Component } from 'react';
import { Pie } from 'react-chartjs-2';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   statusName: [],
    //   numbers: [],
    // };
    this.statusName = [];
    this.getStatusNames = this.getStatusNames.bind(this);
    this.getNumberOfTasks = this.getNumberOfTasks.bind(this);
  }

  async componentWillMount() {
    this.getStatusNames();
    // this.getNumberOfTasks();
  }

  getStatusNames() {
    const data = [];
    this.props.project.statuses.forEach((status) => {
      data.push(status.name);
    });
    this.statusName = data;
    // this.setState({
    //   statusName: data,
    // });
  }

  getNumberOfTasks() {
    const numbers = [];
    const tasks = this.props.tasks;
    // console.log(tasks);
    this.statusName.forEach((status) => {
      let count = 0;
      tasks.forEach((task) => {
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
