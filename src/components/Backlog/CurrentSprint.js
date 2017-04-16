import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Badge, Label } from 'react-bootstrap';
import moment from 'moment';
import 'simple-line-icons/css/simple-line-icons.css';
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
      await apiHelper.put(`/api/sprints/${this.state.sprint.id}`, {
        sprint: {
          is_ended: true,
        },
      });
      this.setState({
        sprint: {},
        currentTasks: [],
      });
      await this.props.reloadPage();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { sprint } = this.state;
    const rowStyle = {
      paddingTop: 5,
      paddingBottom: 5,
      cursor: 'default',
    };
    const currentTaskNode = this.state.currentTasks.map((task) => {
      return (
        <Row key={task.id} style={rowStyle}>
          <li id="task">
            <Col xs={12}>
              <span id="taskName">
                {task.name}
                <div className="pull-right">
                  <Label style={{ marginTop: 2, marginRight: 5 }}>{task.feature.name}</Label>
                  <Badge>{task.story_point}</Badge>
                </div>
              </span>
            </Col>
          </li>
        </Row>
      );
    });
    return (
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
      </div>
    );
  }
}

CurrentSprint.propTypes = {
  reloadPage: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default CurrentSprint;
