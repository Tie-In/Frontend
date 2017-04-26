import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import StoryPoint from './StoryPoint';
import TaskStatus from './TaskStatus';
import ContributorTask from './ContributorTask';
import RemianingTasks from './RemainingTasks';
import * as apiHelper from '../../helpers/apiHelper';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project,
      sprints: this.props.project.sprints,
      selectedSprint: {},
      tasks: [],
      statuses: [],
      totalTasks: [],
    };
    this.handleSelectSprint = this.handleSelectSprint.bind(this);
  }

  async componentWillMount() {
    try {
      const { project } = this.props;
      const taskResponse = await apiHelper.get('/api/tasks', {
        project: project.id,
      });

      const lastestSprint = project.sprints[project.sprints.length-1].id;
      const responseSprint = await apiHelper.get(`/api/sprints/${lastestSprint}`);

      this.setState({
        selectedSprint: responseSprint.data.sprint,
        tasks: responseSprint.data.sprint.tasks,
        statuses: responseSprint.data.statuses,
        totalTasks: taskResponse.data,
      });
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
      console.log('=======');
      console.log(`selected id : ${id}`);

      const responseSprint = await apiHelper.get(`/api/sprints/${id}`);

      this.setState({
        selectedSprint: responseSprint.data.sprint,
        tasks: responseSprint.data.sprint.tasks,
        statuses: responseSprint.data.statuses,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { project } = this.props;
    const columnStyle = {
      marginBottom: '20px',
    };
    const selectStyle = {
      marginBottom: 0,
      marginTop: '12px',
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
          <option value={sprint.number} key={`sprint${sprint.number}`} selected>Sprint {sprint.number}</option>
        );
      }
      return (
        <option value={sprint.number} key={`sprint${sprint.number}`}>Sprint {sprint.number}</option>
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
            <RemianingTasks
              key={project.id}
              project={project}
              tasks={this.state.tasks}
              sprint={this.state.selectedSprint}
              colors={colors}
              colorsHover={colorsHover}
              totalTasks={this.state.totalTasks}
            />
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
              sprint={this.state.selectedSprint}
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
              sprint={this.state.selectedSprint}
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
