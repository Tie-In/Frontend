import React, { PropTypes, Component } from 'react';
import { Bar } from 'react-chartjs-2';

class DevTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusName: [],
      numbers: [],
    };
  }

  async componentWillMount() {
    // this.getStatusNames();
    // this.getNumberOfTasks();
  }

  render() {
    const barData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    };

    return (
      <div>
        <Bar data={barData} />
      </div>
    );
  }
}

DevTask.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  project: PropTypes.object.isRequired,
};

export default DevTask;
