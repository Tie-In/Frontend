import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, FormGroup,
  ControlLabel, FormControl, Form } from 'react-bootstrap';
import update from 'immutability-helper';
import List from './List';
import * as apiHelper from '../../helpers/apiHelper';
import './retrospective.css'

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  // async componentWillMount() {
  //   try {
  //     const response = await apiHelper.get(`/api/retrospectives/${}`);
  //     const data = response.data;
  //     this.setState({ comments: data });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  render() {
    return (
      <div className="tiein-container">
        <h3 className="header-label">Retrospective management</h3>
        <hr className="header-line" />
      </div>
    );
  }
}

Management.propTypes = {
};

export default Management;