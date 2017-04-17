import React, { PropTypes, Component } from 'react';
import { Label, Badge } from 'react-bootstrap';
import EditModal from './EditModal';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      openModal: false,
    };

    this.setModal = this.setModal.bind(this);
  }

  setModal(isOpen, task) {
    if (task !== undefined) {
      this.setState({ item: task });
    }
    this.setState({ openModal: isOpen });
  }

  render() {
    const { style } = this.props;
    const { item } = this.state;

    return (
      <div
        style={style} className="item"
        id={style ? item.id : null} onClick={() => { this.setModal(true); }}
      >
        <div className="item-name">
          {item.name} <Badge pullRight>{item.story_point}</Badge>
        </div>
        <div className="item-container">
          <div className="item-content">
            <p>{item.description}</p>
          </div>
          <div>
            {item.tags.map((tag) => {
              const labelStyle = {
                backgroundColor: tag.color,
                marginRight: '10px',
              };
              return <Label key={tag.id} style={labelStyle}>{tag.name}</Label>;
            })}
            <div className="perfomer">
              { item.user ?
                <img
                  src={item.user.image}
                  alt="Perfomer"
                /> : <div />
              }
            </div>
          </div>
        </div>
        { this.state.openModal ?
          <EditModal show={this.state.openModal} item={item} setShow={this.setModal} /> :
          <div />
        }
      </div>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default Card;
