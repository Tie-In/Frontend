import React, { Component, PropTypes } from 'react';
import { Badge } from 'react-bootstrap';
import Cards from './Cards';

export default class CardsContainer extends Component {
  static propTypes = {
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool,
    name: PropTypes.string,
  }

  render() {
    const { item, x, moveCard, name } = this.props;
    const totalPoints = () => {
      let points = 0;
      item.tasks.map((task) => {
        points += task.story_point;
      })
      return points;
    }
    
    return (
      <div className="desk">
        <div className="desk-head">
          <div className="desk-name">
            {name} <Badge pullRight>{totalPoints()}</Badge>
          </div>
        </div>
        <Cards
          moveCard={moveCard}
          x={x}
          cards={item.tasks}
          startScrolling={this.props.startScrolling}
          stopScrolling={this.props.stopScrolling}
          isScrolling={this.props.isScrolling}
        />
      </div>
    );
  }
}
