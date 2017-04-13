import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import 'simple-line-icons/css/simple-line-icons.css';
import update from 'immutability-helper';
import EditTaskModal from './EditTaskModal';
import PointEstimationModal from './PointEstimationModal';
import './backlog.css';
import * as apiHelper from '../../helpers/apiHelper';

class CurrentSprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: {},
      currentTasks: [],
      showEditTask: false,
      task: {},
    };

    this.stopSprint = this.stopSprint.bind(this);
  }

  async componentWillMount() {
    const { project } = this.props;
    try {
      const response = await apiHelper.get('/api/tasks', {
        project: project.id,
        sprint: project.current_sprint_id,
      });
      const tasks = response.data;
      this.setState({ currentTasks: tasks });

      const responseSprint = await apiHelper.get(`/api/sprints/${project.current_sprint_id}`);
      const data = responseSprint.data;
      this.setState({ sprint: data.sprint });
      console.log(data.sprint);
    } catch (err) {
      console.log(err);
    }
  }

  async stopSprint() {
    try {
      const responseSprint = await apiHelper.put(`/api/sprints/${this.state.sprint.id}`, {
        sprint: {
          is_ended: true,
        },
      });
      const data = responseSprint.data;
      this.setState({ 
        sprint: {},
        currentTasks: [], 
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { sprint } = this.state;
    const rowStyle = {
      paddingTop: 5,
      paddingBottom: 5,
    };
    const currentTaskNode = this.state.currentTasks.map((task) => {
      return (
        <Row key={task.id} style={rowStyle}>
          <li id="task">
            <Col xs={12}>
              <span id="taskName">
                {task.name}<Badge pullRight>{task.story_point}</Badge>
              </span>
            </Col>
          </li>
        </Row>
      );
    });
    return (
      this.state.sprint.id ? 
        <div>
            <Row style={{ borderBottom: 'solid 1px' }}>
              <Col sm={4}>
                <h4>Sprint {sprint.number} (Current)</h4>
              </Col>
              <Col sm={3}>
                <p style={{ paddingTop: 10 }}>Sprint points: {sprint.sprint_points}</p>
              </Col>
              <Col sm={3}>
                <p style={{ paddingTop: 10 }}>Start date: {moment(sprint.start_date).format('L')}</p>
              </Col>
              <Col sm={2}>
                <Button onClick={this.stopSprint}>Stop sprint</Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={12}>
                <ul className="backlog" id="taskslist">{currentTaskNode}</ul>
              </Col>
            </Row>
        </div> : <div />
    );
  }
}

CurrentSprint.propTypes = {
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps)(CurrentSprint);
