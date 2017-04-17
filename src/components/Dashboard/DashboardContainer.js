import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Col } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import * as apiHelper from '../../helpers/apiHelper';
import * as projectActionsCreator from '../../actions/project-actions';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project,
      sprints: this.props.project.sprints,
      tasks: '',
    };
    this.getDates = this.getDates.bind(this);
  }

  async componentWillMount() {
    try {
      const sprint = this.state.sprints.slice(-1);
      const sprintResponse = await apiHelper.get('/api/tasks', {
        project: this.props.project.id,
        sprint: sprint[0].id,
      });
      this.setState({ tasks: sprintResponse.data });
    } catch (err) {
      console.log(err);
    }
  }

  getDates() {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  }

  render() {
    const data1 = {
      labels: this.getDates,
      datasets: [{
        label: 'Sales',
        type: 'line',
        data: [51, 65, 40, 49, 60, 37, 40],
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-1',
      },
      {
        type: 'line',
        label: 'Visitor',
        data: [200, 185, 590, 621, 250, 400, 95],
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1',
      }],
    };
    const options1 = {
      // responsive: true,
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
          },
        ],
      },
    };
    const { project } = this.props;
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        type: 'line',
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        type: 'line',
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90],
      }],
    };
    const pieData = {
      labels: ['Red', 'Green', 'Yellow'],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }],
    };
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
    const columnStyle = {
      marginBottom: '20px',
    };
    const thisPage = {
      color: 'black',
    };
    return (
      <DocumentTitle title={`${project.name}・Dashboard`}>
        <div>
          <h3 className="header-label" >Create new task</h3>
          <hr className="header-line" />
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={thisPage}><FaBarChart /> Burndown Chart</h4>
            <Line data={data} options={options1} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={thisPage}><FaBarChart /> Burndown Chart</h4>
            <Line data={data1} options={options1} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={thisPage}><FaBarChart /> Burndown Chart</h4>
            <Pie data={pieData} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={thisPage}><FaBarChart /> Burndown Chart</h4>
            <Bar data={barData} />
          </Col>
        </div>
      </DocumentTitle>
    );
  }
}

DashboardContainer.propTypes = {
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
