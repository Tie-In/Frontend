import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'react-addons-update';
import { Button, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import FeaturePoint from './FeaturePoint';
import FactorsTable from './FactorsTable';
import { technicalFactors, environmentalFactors } from './informations';
import * as planningActions from '../../actions/planning-actions';
import * as apiHelper from '../../helpers/apiHelper';

class Container extends Component {

  constructor(props) {
    super(props);

    this.state = {
      project_id: this.props.project.id,
      technicals: {},
      environmentals: {},
      t_factor: null,
      e_factor: null,
      uucp: null,
      developers: 0,
    };

    this.setValue = this.setValue.bind(this);
    this.setElements = this.setElements.bind(this);
    this.submit = this.submit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  setValue(name, value) {
    const state = this.state;
    state[name] = value;
  }

  setElements(name, elements) {
    const temp = {};
    for (let i = 0; i < elements.length; i += 1) {
      temp[`rating_factor${i + 1}`] = elements[i];
    }
    const state = this.state;
    state[name] = temp;
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value,
    });
  }

  async submit() {
    try {
      await apiHelper.post('/api/effort_estimations', {
        effort_estimations: this.state,
        features: this.props.planning.features,
        technicals: this.state.technicals,
        environmentals: this.state.environmentals,
      });
      this.props.planningActions.clearPlanning();
      document.location.href = `/organizations/${this.props.params.organizationId}/projects/${this.state.project_id}/planning`;
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { planning } = this.props;
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
      <div className="effortEstimation" style={containerStyle}>
        <h3 style={headerStyle}>Effort Estimation</h3>
        <hr style={lineColor} />
        <FeaturePoint features={planning.features} setValue={this.setValue} />
        <br />
        <FactorsTable
          title="Calcuate Technical Complexity"
          factors={technicalFactors}
          resultLabel="TFactor (Technical Factor)"
          setValue={this.setValue}
          valueTitle="t_factor"
          elementsTitle="technicals"
          setElements={this.setElements}
        />
        <br />
        <FactorsTable
          title="Calcuate Environmental Complexity"
          factors={environmentalFactors}
          resultLabel="EFactor (Environmental Factor)"
          setValue={this.setValue}
          valueTitle="e_factor"
          elementsTitle="environmentals"
          setElements={this.setElements}
        />
        <br />
        <Row>
          <Col sm={8}>
            <h4>Total number of developers</h4>
          </Col>
          <Col sm={4}>
            <FormGroup>
              <FormControl
                placeholder=""
                type="number"
                name="developers"
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col smOffset={2} sm={4}>
            <Button bsStyle="primary" block>Back</Button>
          </Col>
          <Col sm={4}>
            <Button onClick={this.submit} block>Next</Button>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

Container.propTypes = {
  project: PropTypes.object.isRequired,
  planning: PropTypes.object.isRequired,
  planningActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    planning: state.planning,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    planningActions: bindActionCreators(planningActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
