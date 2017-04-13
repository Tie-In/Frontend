import React, { PropTypes, Component } from 'react';
import { Label } from 'react-bootstrap';
import image1 from '../../../images/user1.png';
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
        id={style ? item.id : null} onClick={() => this.setModal(true)}
      >
        <div className="item-name">
          {item.name}
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
              <img
                src={`../../../../src/images/user${item.assignee_id}.png`}
                alt="Perfomer"
              />
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
