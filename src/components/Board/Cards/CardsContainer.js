import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { Glyphicon, Dropdown, MenuItem } from 'react-bootstrap';
import linkState from 'react-link-state';
import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    return {
      id: props.id,
      x: props.x
    };
  },
  endDrag(props) {
    props.stopScrolling();
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    if (!props.isScrolling) {
      if (window.innerWidth - monitor.getClientOffset().x < 200) {
        props.startScrolling('toRight');
      } else if (monitor.getClientOffset().x < 200) {
        props.startScrolling('toLeft');
      }
    } else {
      if (window.innerWidth - monitor.getClientOffset().x > 200 &&
          monitor.getClientOffset().x > 200
      ) {
        props.stopScrolling();
      }
    }
    const { id: listId } = monitor.getItem();
    const { id: nextX } = props;

    if (listId !== nextX) {
      props.moveList(listId, props.x);
    }
  }
};

@DropTarget('list', listTarget, connectDragSource => ({
  connectDropTarget: connectDragSource.dropTarget(),
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool,
    name: PropTypes.string,
    deleteStatus: PropTypes.func.isRequired,
    editStatus: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      onEdit: false,
      name: this.props.item.name,
    };

    this.edit = this.edit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    const { name } = this.state;
    if (name !== '' && name !== this.props.item.name) {
      this.props.editStatus(this.props.item, name);
      this.setState({ onEdit: false });
    }
  }

  edit() {
    this.setState({ onEdit: true });
  }

  render() {
    const { connectDropTarget, connectDragSource, item, x, moveCard,
      isDragging, name, deleteStatus } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    const inputStyle = {
      width: '80%',
      marginRight: '10%',
    };

    return connectDragSource(connectDropTarget(
      <div className="desk" style={{ opacity }}>
        <div className="desk-head">
          { this.state.onEdit ?
            <div>
              <input
                style={inputStyle} type="text"
                valueLink={linkState(this, 'name')} autoFocus="true"
                onBlur={this.onBlur}
              />
              <Glyphicon glyph="remove" />
            </div>
          :
            <div className="desk-name">
              {name} <Dropdown className="pull-right" id="card-container-dropdown">
                <Dropdown.Toggle noCaret>
                  <Glyphicon glyph="option-vertical" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem
                    eventKey="1"
                    onClick={() => { this.edit(); }}
                  >Edit name</MenuItem>
                  <MenuItem
                    eventKey="2"
                    onClick={() => { deleteStatus(item); }}
                  >Delete</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          }
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
    ));
  }
}
