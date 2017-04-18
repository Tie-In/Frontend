import { Row, Col, Button, Panel } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';

class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
    };
  }

  render() {
    const { comment } = this.props;
    return (
      <div>
        <Col sm={4}>
          <Panel>
            {comment}
          </Panel>
        </Col>
      </div>
    );
  }
}
Category.propTypes = {
  comment: PropTypes.string.isRequired,
};

export default Category;
