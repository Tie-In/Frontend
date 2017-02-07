import { Row, Col, Glyphicon, ButtonToolbar, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

class List extends Component {
  // removeFeature(){
  //   this.props.remove(this.props.index);
  // }

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
            <Col sm={2}>
              <Button bsStyle="primary">
                <Glyphicon glyph="pencil" />
              </Button>
            </Col>
            <Col sm={2} smOffset={3}>
              <Button bsStyle="primary">
                <Glyphicon glyph="remove" />
              </Button>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default List;
