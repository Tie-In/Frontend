import React, { PropTypes, Component } from 'react';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import { Pie } from 'react-chartjs-2';
import moment from 'moment';

class TaskStatus extends Component {
  constructor(props) {
    super(props);
  }

  startSprint() {
    return this.convertToLocalDate(this.props.sprint.start_date);
  }

  render() {
    console.log(this.props.project);
    const pieData = {
      labels: ['Red', 'Green', 'Yellow'],
      datasets: [{
        data: [300, 50, 100],
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
  sprint: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

export default TaskStatus;
