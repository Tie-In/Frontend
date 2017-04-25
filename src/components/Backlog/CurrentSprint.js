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
            <Col xs={8}>
              <span id="taskName">
                {task.name}
                { task.feature ?
                  <Label bsStyle="primary" style={{ marginTop: 3, marginLeft: 10 }}>
                    {task.feature.name}
                  </Label> : <div />
                }
              </span>
            </Col>
            <Col xs={3}>
              { task.tags.map((tag) => {
                const labelStyle = {
                  backgroundColor: tag.color,
                  color: 'white',
                  marginTop: 3,
                  marginRight: 10,
                };
                return (
                  <Label key={tag.id} style={labelStyle}>
                    {tag.name}
                  </Label>
                );
              })
              }
            </Col>
            <Col xs={1}>
              <Badge>{task.story_point}</Badge>
            </Col>
          </li>
        </Row>
      );
    });
    return (
      <div>
        <Row>
          <Col sm={4}>
            <h3 className="backlog-title" style={{ marginBottom: 0 }}>Sprint {sprint.number} (Current)</h3>
          </Col>
          <Col sm={3}>
            <p style={{ marginTop: 30 }}>Sprint points: {sprint.sprint_points}</p>
          </Col>
          <Col sm={3}>
            <p style={{ marginTop: 30 }}>Start date: {moment(sprint.start_date).format('L')}</p>
          </Col>
          <Col sm={2}>
            { this.props.permission === 'admin' ?
              <Button style={{ marginTop: 20 }} onClick={this.stopSprint}>Stop sprint</Button>
              : <div />
            }
          </Col>
        </Row>
        <hr className="header-line" />
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
  permission: PropTypes.string.isRequired,
};

export default CurrentSprint;
