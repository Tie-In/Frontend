import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as listsActions from '../../actions/list-actions';
import * as projectActions from '../../actions/project-actions';
import '../../style/board.css';
import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';
import * as apiHelper from '../../helpers/apiHelper';

@DragDropContext(HTML5Backend)
class Board extends Component {
  static propTypes = {
    listsActions: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    lists: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.createList = this.createList.bind(this);
    this.state = {
      isScrolling: false,
      sprintNumber: '',
    };
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get(`/api/projects/${this.props.params.projectId}`);
      const project = response.data;
      this.props.projectActions.setProject(project);

      if ( project.current_sprint_id ) {
        const responseSprint = await apiHelper.get(`/api/sprints/${project.current_sprint_id}`);
        const data = responseSprint.data;
        this.setState({ sprintNumber: data.sprint.number });
        const statuses = data.statuses;
        this.props.listsActions.setList(statuses);
      }
    } catch (err) {
      console.log(err);
    }
  }

  startScrolling(direction) {
    // if (!this.state.isScrolling) {
    switch (direction) {
      case 'toLeft':
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case 'toRight':
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
    }
    // }
  }

  scrollRight() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  stopScrolling() {
    this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
  }

  moveCard(lastX, lastY, nextX, nextY) {
    this.props.listsActions.moveCard(lastX, lastY, nextX, nextY);
  }

  async createList(listName) {
    const { lists } = this.props;
    const response = await apiHelper.post('/api/statuses', {
      name: listName,
      project_id: this.props.params.projectId,
      column: lists.length,
    });
    const temp = response.data;

    lists.push(temp);
    this.setState({ isScrolling: true }, this.scrollRight());
    this.props.listsActions.setList(lists);
  }

  findList(id) {
    const { lists } = this.props;
    const list = lists.filter(l => l.id === id)[0];

    return {
      list,
      lastX: lists.indexOf(list),
    };
  }

  render() {
    const { lists } = this.props;
    const width = 300 * (lists.length + 1);
    const customWidth = {
      width: `${width}px`,
    };

    return (
      <main style={customWidth}>
        <div>
          <CustomDragLayer snapToGrid={false} />
          {lists.map((item, i) => {
            return (<CardsContainer
              key={item.id}
              id={item.id}
              name={item.name}
              item={item}
              moveCard={this.moveCard}
              startScrolling={this.startScrolling}
              stopScrolling={this.stopScrolling}
              isScrolling={this.state.isScrolling}
              x={i}
            />);
          },
          )}
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists.lists,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listsActions: bindActionCreators(listsActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
