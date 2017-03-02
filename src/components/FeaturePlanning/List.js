import { Row, Col, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class List extends Component {
  render() {
    const { name, complexity } = this.props;
    const listStyle = {
      marginBottom: '15px',
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
            <ButtonToolbar>
              <Button bsStyle="primary">
                <Glyphicon glyph="pencil" />
              </Button>
              <Button bsStyle="primary">
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </div>
    );
  }
}
List.propTypes = {
  name: PropTypes.string.isRequired,
  complexity: PropTypes.string.isRequired,
};

export default List;
