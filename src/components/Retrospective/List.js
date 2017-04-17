import { Row, Col, Glyphicon, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      type: this.props.type,
    };
  }

  render() {
    const { comment, type, index, remove } = this.props;
    return (
      <div>
        <Row>
          <Col sm={8}>
            {comment}
          </Col>
          <Col sm={2}>
            {titleCase(type)}
          </Col>
          <Col sm={2}>
            <Button
              bsStyle="primary"
              onClick={() => { remove(index); }}
            >
              <Glyphicon glyph="remove" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
List.propTypes = {
  comment: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.number,
  remove: PropTypes.func.isRequired,
};

export default List;
