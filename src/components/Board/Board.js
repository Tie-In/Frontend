import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as listsActions from '../../actions/list-actions';
import '../../style/board.css';
import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';
import NewList from './Cards/NewList';

@DragDropContext(HTML5Backend)
class Board extends Component {
  static propTypes = {
    listsActions: PropTypes.object.isRequired,
    lists: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.createList = this.createList.bind(this);
    this.state = { isScrolling: false };
  }

  componentWillMount() {
    const mock = [
      {"id": 0,"name":"Incredible Metal Hat","cards":[{"id":0,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"}]},
      {"id": 1,"name":"Increasadasds","cards":[{"id":10,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"}]},
      {"id": 2,"name":"Incasdasd", "cards": []},
    ];

    this.props.listsActions.setList(mock);
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

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    this.props.listsActions.moveList(lastX, nextX);
  }

  createList(listName) {
    const { lists } = this.props;
    const temp = { id: lists.length, name: listName, cards: [] };
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
    const width = 100 + ((lists.length - 2) * 20);
    const customWidth = {
      width: `${width}%`,
    };

    return (
      <main style={customWidth}>
        <CustomDragLayer snapToGrid={false} />
        {lists.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            name={item.name}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            startScrolling={this.startScrolling}
            stopScrolling={this.stopScrolling}
            isScrolling={this.state.isScrolling}
            x={i}
          />
        )}
        <NewList createList={this.createList} />
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
