import React, { PropTypes } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

const galPng = require('../../../images/gal.png');
const delPng = require('../../../images/del.png');


const Card = (props) => {
  const { style, item } = props;

  return (
    <div style={style} className="item" id={style ? item.id : null}>
      <div className="item-name">
        Card ID
        <Glyphicon className="pull-right" glyph="option-vertical" />
      </div>
      <div className="item-container">
        <div className="item-content">
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </div>
      <div className="item-perfomers">
        <Label bsStyle="success">Issue</Label>
        <div className="perfomer">
          <img
            src={`https://randomuser.me/api/portraits/thumb/men/3.jpg`}
            alt="Perfomer"
          />
        </div>
      </div>
      {/* <div className="item-perfomers">
        <div className="add-perfomers">
          <a href="#"><img src={galPng} alt="Add perfomers" /></a>
          <div className="perfomer">
            <img
              src={`https://randomuser.me/api/portraits/thumb/men/${item.id + 1}.jpg`}
              alt="Perfomer"
            />
          </div>
          <div className="perfomer">
            <img
              src={`https://randomuser.me/api/portraits/thumb/men/${item.id + 2}.jpg`}
              alt="Perfomer"
            />
          </div>
          <div className="perfomer">
            <img
              src={`https://randomuser.me/api/portraits/thumb/men/${item.id + 3}.jpg`}
              alt="Perfomer"
            />
          </div>
        </div>
        <div className="delete-perfomers">
          <a href="#"><img src={delPng} alt="Delete perfomers" /></a>
          <div className="perfomer">
            <img
              src={`https://randomuser.me/api/portraits/thumb/men/${item.id + 4}.jpg`}
              alt="Perfomer"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

Card.propTypes = propTypes;

export default Card;
