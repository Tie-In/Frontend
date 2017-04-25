import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import StoryPoint from './StoryPoint';
import TaskStatus from './TaskStatus';
import ContributorTask from './ContributorTask';
import * as apiHelper from '../../helpers/apiHelper';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project,
      sprints: this.props.project.sprints,
      // selectedSprint: this.props.project.sprints.slice(-1)[0],
      selectedSprint: {},
      tasks: [],
      statuses: [],
    };
    this.handleSelectSprint = this.handleSelectSprint.bind(this);
  }

  async componentWillMount() {
    try {
      const { project } = this.props;
      // console.log(project.current_sprint_id);
      const taskResponse = await apiHelper.get('/api/tasks', {
        project: project.id,
        sprint: project.current_sprint_id,
      });

      const responseSprint = await apiHelper.get(`/api/sprints/${project.current_sprint_id}`);

      this.setState({
        selectedSprint: responseSprint.data.sprint,
        tasks: taskResponse.data,
        statuses: responseSprint.data.statuses,
      });
      console.log(this.state.tasks);
      console.log(this.state.selectedSprint);
      console.log(this.state.statuses);
    } catch (err) {
      console.log(err);
    }
  }

  getLocalDate(serverDate) {
    if (serverDate === null) {
      return '-';
    }
    const date = moment.utc(serverDate).local();
    return `${moment(date).get('year')}/${moment(date).get('month') + 1}/${moment(date).get('date')}`;
  }

  async handleSelectSprint(e) {
    const inputIndex = e.target.value - 1;
    // console.log(inputIndex);
    try {
      const { project } = this.props;
      const id = project.sprints[inputIndex].id;
      console.log(`selected id : ${id}`);
      const taskResponse = await apiHelper.get('/api/tasks', {
        project: project.id,
        sprint: id,
      });

      const responseSprint = await apiHelper.get(`/api/sprints/${id}`);

      this.setState({
        selectedSprint: responseSprint.data.sprint,
        tasks: taskResponse.data,
        statuses: responseSprint.data.statuses,
      });
      console.log('=======');
      console.log(this.state.tasks);
      console.log(this.state.selectedSprint);
      console.log(this.state.statuses);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
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
    // console.log(project);
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        type: 'line',
        label: 'Actual',
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
        label: 'Expected',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90],
      }],
    };
    const columnStyle = {
      marginBottom: '20px',
    };
    const selectStyle = {
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
    const h4 = {
      color: '#A25E5D',
      marginTop: '20px',
    };
    const start = this.getLocalDate(this.state.selectedSprint.start_date);
    const end = this.getLocalDate(this.state.selectedSprint.end_date);
    const duration = project.sprint_duration;
    const contributors = project.project_contributes.length;
    const colors = [
      'rgba(244, 159, 144, 0.6)',
      'rgba(181, 60, 41, 0.6)',
      'rgba(255, 228, 165, 0.6)',
      'rgba(211, 80, 86, 0.6)',
      'rgba(244, 159, 144, 0.6)',
      'rgba(255, 63, 73, 0.6)',
      'rgba(255, 63, 73, 0.6)',
      'rgba(178, 53, 70, 0.6)',
    ];
    const colorsHover = [
      'rgba(244, 159, 144, 0.9)',
      'rgba(181, 60, 41, 0.9)',
      'rgba(255, 228, 165, 0.9)',
      'rgba(211, 80, 86, 0.9)',
      'rgba(244, 159, 144, 0.9)',
      'rgba(255, 63, 73, 0.9)',
      'rgba(255, 63, 73, 0.9)',
      'rgba(178, 53, 70, 0.9)',
    ];
    const selectSprint = this.state.sprints.map((sprint) => {
      if (sprint.number === this.state.sprints.length) {
        return (
          <option value={sprint.number} key={`sprint${sprint.number}`} selected>{sprint.number}</option>
        );
      }
      return (
        <option value={sprint.number} key={`sprint${sprint.number}`}>{sprint.number}</option>
      );
    });

    if (!this.state.tasks) {
      return null;
    }

    return (
      <DocumentTitle title={`${project.name}・Dashboard`}>
        <div>
          <Row style={row}>
            <Col md={10}><h3 className="header-label" style={h3}>Dashboard : Sprint {this.state.selectedSprint.number}</h3></Col>
            <Col md={2}>
              <FormGroup style={selectStyle} onChange={this.handleSelectSprint}>
                <FormControl componentClass="select">
                  <option value="">Select sprint</option>
                  {selectSprint}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <hr className="header-line" />
          <p>Total estimated points : {this.state.selectedSprint.sprint_points}</p>
          <p>Status : {this.state.selectedSprint.is_ended ? 'end' : 'working'}</p>
          <p>Start date : {start}</p>
          <p>End date : {end}</p>
          <p>Number of contributor : {contributors}</p>
          <p style={{ marginBottom: '10px' }}>Sprint duration : {duration > 1 ? `${duration} weeks` : `${duration} week`}</p>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={h4}><FaBarChart /> Remaining tasks in each sprint</h4>
            <Line data={data} options={options1} />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={h4}><FaBarChart /> Remaining points in each day</h4>
            <StoryPoint
              key={project.id}
              project={project}
              tasks={this.state.tasks}
              sprint={this.state.selectedSprint}
              colors={colors}
              colorsHover={colorsHover}
              statuses={this.state.statuses}
            />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={h4}><FaBarChart /> Number of tasks of each status</h4>
            <TaskStatus
              key={project.id}
              tasks={this.state.tasks}
              project={project}
              colors={colors}
              colorsHover={colorsHover}
              statuses={this.state.statuses}
            />
          </Col>
          <Col xs={12} md={6} style={columnStyle}>
            <h4 style={h4}><FaBarChart /> Story points in charge of each user</h4>
            <ContributorTask
              key={project.id}
              tasks={this.state.tasks}
              project={project}
              colors={colors}
              colorsHover={colorsHover}
              statuses={this.state.statuses}
            />
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
