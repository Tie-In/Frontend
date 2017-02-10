import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as ListsActions from '../../actions/list-actions';
import '../../style/board.css';
import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

// function mapStateToProps(state) {
//   return {
//     lists: state.lists.lists,
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(ListsActions, dispatch);
// }

// @connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    getLists: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired,
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
    this.state = { isScrolling: false };
  }

  componentWillMount() {
    // this.props.getLists(10);
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
    // this.props.moveCard(lastX, lastY, nextX, nextY);
    console.log(lastX, lastY, nextX, nextY);
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    // this.props.moveList(lastX, nextX);
    console.log(lastX, nextX);
  }

  findList(id) {
    const { lists } = this.props;
    const mock = [{"id":0,"name":"Incredible Metal Hat","cards":[{"id":0,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"},{"id":1,"firstName":"Lela","lastName":"Braun","title":"Internal Web Technician"},{"id":2,"firstName":"Roy","lastName":"Friesen","title":"Investor Paradigm Designer"},{"id":3,"firstName":"Bria","lastName":"Hoppe","title":"Chief Factors Director"},{"id":4,"firstName":"Walton","lastName":"Kautzer","title":"Product Communications Designer"},{"id":5,"firstName":"Tierra","lastName":"Wehner","title":"Human Interactions Strategist"},{"id":6,"firstName":"Elinor","lastName":"Quitzon","title":"Global Configuration Associate"},{"id":7,"firstName":"Coleman","lastName":"Koss","title":"National Intranet Strategist"}]},
        {"id":1,"name":"Incredible Metal Hat","cards":[{"id":0,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"},{"id":1,"firstName":"Lela","lastName":"Braun","title":"Internal Web Technician"},{"id":2,"firstName":"Roy","lastName":"Friesen","title":"Investor Paradigm Designer"},{"id":3,"firstName":"Bria","lastName":"Hoppe","title":"Chief Factors Director"},{"id":4,"firstName":"Walton","lastName":"Kautzer","title":"Product Communications Designer"},{"id":5,"firstName":"Tierra","lastName":"Wehner","title":"Human Interactions Strategist"},{"id":6,"firstName":"Elinor","lastName":"Quitzon","title":"Global Configuration Associate"},{"id":7,"firstName":"Coleman","lastName":"Koss","title":"National Intranet Strategist"}]}];

    const list = mock.filter(l => l.id === id)[0];

    return {
      list,
      lastX: mock.indexOf(list)
    };
  }

  render() {
    const { lists } = this.props;
    const mock = [{"id":0,"name":"Incredible Metal Hat","cards":[{"id":0,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"},{"id":1,"firstName":"Lela","lastName":"Braun","title":"Internal Web Technician"},{"id":2,"firstName":"Roy","lastName":"Friesen","title":"Investor Paradigm Designer"},{"id":3,"firstName":"Bria","lastName":"Hoppe","title":"Chief Factors Director"},{"id":4,"firstName":"Walton","lastName":"Kautzer","title":"Product Communications Designer"},{"id":5,"firstName":"Tierra","lastName":"Wehner","title":"Human Interactions Strategist"},{"id":6,"firstName":"Elinor","lastName":"Quitzon","title":"Global Configuration Associate"},{"id":7,"firstName":"Coleman","lastName":"Koss","title":"National Intranet Strategist"}]},
    {"id":1,"name":"Incredible Metal Hat","cards":[{"id":0,"firstName":"Abigail","lastName":"Torp","title":"Lead Interactions Supervisor"},{"id":1,"firstName":"Lela","lastName":"Braun","title":"Internal Web Technician"},{"id":2,"firstName":"Roy","lastName":"Friesen","title":"Investor Paradigm Designer"},{"id":3,"firstName":"Bria","lastName":"Hoppe","title":"Chief Factors Director"},{"id":4,"firstName":"Walton","lastName":"Kautzer","title":"Product Communications Designer"},{"id":5,"firstName":"Tierra","lastName":"Wehner","title":"Human Interactions Strategist"},{"id":6,"firstName":"Elinor","lastName":"Quitzon","title":"Global Configuration Associate"},{"id":7,"firstName":"Coleman","lastName":"Koss","title":"National Intranet Strategist"}]}];
    return (
      <main>
        <div style={{ height: '100%' }}>
          <CustomDragLayer snapToGrid={false} />
          {mock.map((item, i) =>
            <CardsContainer
              key={item.id}
              id={item.id}
              item={item}
              moveCard={this.moveCard}
              moveList={this.moveList}
              startScrolling={this.startScrolling}
              stopScrolling={this.stopScrolling}
              isScrolling={this.state.isScrolling}
              x={i}
            />
          )}
        </div>
      </main>
    );
  }
}