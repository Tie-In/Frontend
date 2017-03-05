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
      error: false,
    };

    this.addFeature = this.addFeature.bind(this);
    this.sendFeatures = this.sendFeatures.bind(this);
    this.removeFeature = this.removeFeature.bind(this);
  }

  addFeature() {
    if (this.state.input.name === '') {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });
      const temp = this.state.input;
      const featuresTemp = this.state.features;
      featuresTemp.push(temp);
      this.setState({
        input: {
          name: '',
          complexity: 'simple',
        },
        features: featuresTemp,
      });
    }
  }

  sendFeatures() {
    this.props.planningActions.setFeatures(this.state.features);
    document.location.href = 'effort-estimation';
  }

  doSomething(e) {
    e.preventDefault();
  }

  removeFeature(index) {
    const temp = this.state.features;
    temp.splice(index, 1);
    this.setState({ features: temp });
  }

  render() {
    const { features } = this.state;
    return (
      <div className="tieinContainer">
        <h3 className="header-label">Add Planning Feature</h3>
        <hr className="header-line" />
        <form onSubmit={this.doSomething}>
          <Row>
            <Col sm={8}>
              <FormGroup validationState={this.state.error ? 'error' : null}>
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
        {features.map((data) => {
          const index = features.indexOf(data);
          return (<List
            key={index}
            name={data.name} index={index}
            complexity={data.complexity}
            remove={this.removeFeature}
          />);
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
FeaturePlanningContainer.propTypes = {
  planning: PropTypes.object.isRequired,
  planningActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    planning: state.planning,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    planningActions: bindActionCreators(planningActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturePlanningContainer);
