import React, { PropTypes } from 'react';
import { Label } from 'react-bootstrap';
import image1 from '../../../images/user1.png';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
};


const Card = (props) => {
  const { style, item } = props;

  return (
    <div style={style} className="item" id={style ? item.id : null}>
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
    </div>
  );
};

Card.propTypes = propTypes;

export default Card;
