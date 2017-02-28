import React, { PropTypes, Component } from 'react';
import { Label } from 'react-bootstrap';
import image1 from '../../../images/user1.png';
import EditModal from './EditModal';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
};


class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.setModal = this.setModal.bind(this);
  }

  setModal(isOpen) {
    this.setState({ openModal: isOpen });
  }

  render() {
    const { style, item } = this.props;

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
              return <Label style={labelStyle}>{tag.name}</Label>;
            })}
            <div className="perfomer">
              <img
                src={image1}
                alt="Perfomer"
              />
            </div>
          </div>
        </div>
        <EditModal show={this.state.openModal} item={item} setShow={this.setModal} />
      </div>
    );
  }
}

Card.propTypes = propTypes;

export default Card;
