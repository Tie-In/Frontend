import {
  Row, FormGroup, Col, Button,
  FormControl, ControlLabel,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import List from './List';
import * as planningActions from '../../actions/planning-actions';

class FeaturePlanningContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      features: this.props.planning.features,
      input: {
        name: '',
        complexity: 'simple',
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

  doSomething(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="tieinContainer">
        <h3 className="headerLabel">Add Planning Feature</h3>
        <hr className="headerLine" />
        <form onSubmit={this.doSomething}>
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
                <Button onClick={this.addFeature} type="submit" block>Add</Button>
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
