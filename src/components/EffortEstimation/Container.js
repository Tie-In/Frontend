import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Button, Row, Col } from 'react-bootstrap';
import FeaturePoint from './FeaturePoint';
import FactorsTable from './FactorsTable';
import { technicalFactors, environmentalFactors } from './informations';
// import * as userActions from '../actions/user-actions';

class Container extends Component {

  constructor(props) {
    super(props);

    this.state = {
      project_id: this.props.project.id,
      technicals: [],
      environmentals: [],
      t_factor: null,
      e_factor: null,
      uucp: null,
    };

    this.setValue = this.setValue.bind(this);
  }

  setValue(name, value) {
    const state = this.state;
    state[name] = value;
  }

  render() {
    const { project, planning } = this.props;
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
        />
        <br />
        <FactorsTable
          title="Calcuate Environmental Complexity"
          factors={environmentalFactors}
          resultLabel="EFactor (Environmental Factor)"
          setValue={this.setValue}
        />
        <br />
        <br />
        <Row>
          <Col smOffset={2} sm={4}>
            <Button bsStyle="primary" block>Back</Button>
          </Col>
          <Col sm={4}>
            <Button block>Next</Button>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

Container.propTypes = {
  user: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  planning: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    project: state.project,
    planning: state.planning,
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(userActions, dispatch),
//   };
// }

export default connect(mapStateToProps)(Container);
