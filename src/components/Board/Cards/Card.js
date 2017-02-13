import React, { PropTypes } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

const Card = (props) => {
  const { style, item } = props;

  return (
    <div style={style} className="item" id={style ? item.id : null}>
      <div className="item-name">
        Card ID {item.id}
        <Glyphicon className="pull-right" glyph="option-vertical" />
      </div>
      <div className="item-container">
        <div className="item-content">
          <p>Lorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit amet</p>
        </div>
        <Label bsStyle="success">Issue</Label>
        <div className="perfomer">
          <img
            src={`https://randomuser.me/api/portraits/thumb/men/3.jpg`}
            alt="Perfomer"
          />
        </div>
      </div>
    </div>
  );
};

Card.propTypes = propTypes;

export default Card;
