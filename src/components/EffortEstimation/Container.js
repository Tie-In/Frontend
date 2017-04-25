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
      project_id: this.props.params.projectId,
      technicals: {},
      environmentals: {},
      t_factor: 0,
      e_factor: 0,
      uucp: 0,
      developers: '',
      lower_weeks: 0,
      upper_weeks: 0,
    };

    this.setValue = this.setValue.bind(this);
    this.setElements = this.setElements.bind(this);
    this.submit = this.submit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.computeDate = this.computeDate.bind(this);
  }

  setValue(name, value) {
    this.setState({ [name]: value });
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
    // console.log(this.state.technicals);
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

  computeDate() {
    const { t_factor, e_factor, uucp, developers } = this.state;
    const TCF = 0.6 + (0.1 * t_factor);
    const ECF = 1.4 + (-0.03 * e_factor);
    const ucp = TCF * ECF * uucp;
    const hourPerWeekPerPerson = 30;
    const lowerHourPerUsecase = 20;
    const upperHourPerUsecase = 28;
    if (developers > 0) {
      const hourPerWeek = hourPerWeekPerPerson * developers;
      const lowerWeeks = Math.floor((ucp * lowerHourPerUsecase) / hourPerWeek);
      const upperWeeks = Math.ceil((ucp * upperHourPerUsecase) / hourPerWeek);
      return {
        lower_weeks: lowerWeeks,
        upper_weeks: upperWeeks,
      };
    }
    return {
      lower_weeks: 0,
      upper_weeks: 0,
    };
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
    const floatStyle = {
      float: 'right',
      position: 'fixed',
      right: '0',
      top: '50%',
      backgroundColor: '#F9F2E8',
      borderRadius: '11px 0px 0px 11px',
      padding: '0px 20px 0 20px',
      zIndex: 99,
    };
    return (
      <div>
        <div style={floatStyle}>
          <div style={{ borderBottom: 'solid 1px darkgrey' }}>
            <h5>Estimated weeks:</h5>
            { this.state.developers !== '' ?
              <h5>{this.computeDate().lower_weeks} - {this.computeDate().upper_weeks} weeks</h5>
            : <h5 style={{ color: '#d9534f' }}>Required more info</h5>
            }
          </div>
          <h5>Developers: {this.state.developers === '' ? 0 : this.state.developers} people</h5>
        </div>
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
