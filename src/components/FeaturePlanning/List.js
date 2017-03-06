import { Row, Col, Glyphicon, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      complexity: this.props.complexity,
    };
  }

  render() {
    const { name, complexity, index, remove } = this.props;
    const listStyle = {
      marginBottom: '15px',
    };
    const buttonStyle = {
      margin: '0 auto',
      display: 'block',
    };
    return (
      <div style={listStyle}>
        <Row>
          <Col sm={8}>
            {name}
          </Col>
          <Col sm={2}>
            {titleCase(complexity)}
          </Col>
          <Col sm={2}>
            <Button
              bsStyle="primary" style={buttonStyle}
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
  name: PropTypes.string.isRequired,
  complexity: PropTypes.string.isRequired,
  index: PropTypes.number,
  remove: PropTypes.func.isRequired,
};

export default List;
