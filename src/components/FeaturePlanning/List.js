import { Row, Col, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

class List extends Component {

  constructor(props) {
    super(props);
  }

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
            {complexity}
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

export default List;
