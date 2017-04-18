import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import moment from 'moment';
import * as apiHelper from '../../helpers/apiHelper';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project,
      sprints: this.props.project.sprints,
      currentSprint: this.props.project.sprints.slice(-1)[0],
      tasks: '',
      startDate: this.getLocalDate(this.props.project.sprints.slice(-1)[0].start_date),
      endDate: this.getLocalDate(this.props.project.sprints.slice(-1)[0].end_date),
    };
    this.getDateSet = this.getDateSet.bind(this);
    // console.log(this.state.project);
    // console.log(this.state.currentSprint);
  }

  async componentWillMount() {
    try {
      const sprint = this.state.sprints.slice(-1);
      const sprintResponse = await apiHelper.get('/api/tasks', {
        project: this.props.project.id,
        sprint: sprint[0].id,
      });
      this.setState({
        tasks: sprintResponse.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  getDateSet() {
    // const start = moment(this.state.startDate).dayOfYear();
    // const end = moment(this.state.endDate).dayOfYear();
    // let day = end - start;
    const labels = [];
    if (!moment(this.state.endDate).isValid()) {
      // const today = moment().dayOfYear();
      // day = today - start;
    }
    for (let i = 0; i < 5; i += 1) {
      const newDate = moment(this.state.startDate).add(i, 'days');
      labels.push(this.getLocalDate(newDate));
    }
    return labels;
  }

  getLocalDate(serverDate) {
    if (serverDate === null) {
      return '-';
    }
    const date = moment.utc(serverDate).local();
    return `${moment(date).get('year')}/${moment(date).get('month') + 1}/${moment(date).get('date')}`;
  }

  render() {
    const data1 = {
      labels: this.getDateSet(),
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
    const selectSprint = {
      marginBottom: 0,
      marginTop: '12px',
      // display: 'inline',
    };
    const row = {
      paddingBottom: 0,
    };
    const h3 = {
      marginBottom: 0,
    };

    return (
      <DocumentTitle title={`${project.name}・Dashboard`}>
        <div>
          <Row style={row}>
            <Col md={10}><h3 className="header-label" style={h3}>Dashboard : Sprint {this.state.currentSprint.number}</h3></Col>
            <Col md={2}>
              <FormGroup style={selectSprint}>
                <FormControl componentClass="select">
                  <option value="">Select sprint</option>
                  <option value="1">1</option>
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <hr className="header-line" />
          <p>Total estimated points: {this.state.currentSprint.sprint_points}</p>
          <p>Start date: {this.state.startDate}</p>
          <p>End date: {this.state.endDate}</p>
          <Col xs={12} md={6} style={columnStyle}>
            <h4><FaBarChart /> Burndown Chart</h4>
            <Line data={data} options={options1} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4><FaBarChart /> Burndown Chart</h4>
            <Line data={data1} options={options1} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4><FaBarChart /> Burndown Chart</h4>
            <Pie data={pieData} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4><FaBarChart /> Burndown Chart</h4>
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

export default connect(mapStateToProps)(DashboardContainer);
