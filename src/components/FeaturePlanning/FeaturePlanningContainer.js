import {
  Row, FormGroup, Col, Button,
  FormControl, ControlLabel,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import List from './List';
import * as planningActions from '../../actions/planning-actions';

class FeaturePlanningContainer extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.planning);
    this.state = {
      features: this.props.planning.features,
      input: {
        name: '',
        complexity: '',
      },
    };

    this.addFeature = this.addFeature.bind(this);
    this.sendFeatures = this.sendFeatures.bind(this);
  }

  addFeature() {
    const temp = this.state.input;
    const featuresTemp = this.state.features;
    featuresTemp.push(temp);
    this.setState({
      input: {
        name: '',
        complexity: '',
      },
      features: featuresTemp,
    });
  }

  sendFeatures() {
    this.props.planningActions.setFeatures(this.state.features);
    document.location.href = 'effort-estimation';
  }

  render() {
    console.log(this.props);
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };
    const headerStyle = {
      color: '#A25E5D',
    };
    const lineColor = {
      borderColor: 'black',
    };
    return (
      <div style={containerStyle}>
        <h3 style={headerStyle}>Add Planning Feature</h3>
        <hr style={lineColor} />
        <form>
          <Row>
            <Col sm={8}>
              <FormGroup>
                <ControlLabel>Feature</ControlLabel>
                <FormControl
                  placeholder="Feature name"
                  valueLink={linkState(this, 'input.name')}
                />
              </FormGroup>
            </Col>
            <Col sm={2}>
              <FormGroup>
                <ControlLabel>Level</ControlLabel>
                <FormControl
                  componentClass="select" placeholder="Complexity"
                  valueLink={linkState(this, 'input.complexity')}
                >
                  <option value="">Select Level</option>
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col sm={2}>
              <FormGroup>
                <ControlLabel>Add</ControlLabel>
                <Button onClick={this.addFeature} block>Add</Button>
              </FormGroup>
            </Col>
          </Row>
        </form>
        {this.state.features.map(function(data) {
          return <List name={data.name} complexity={data.complexity} />;
        })}
        <Row>
          <Col smOffset={4} sm={4}>
            <Button block onClick={this.sendFeatures}>Next</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    planning: state.planning,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    planningActions: bindActionCreators(planningActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturePlanningContainer);
