import React, { PropTypes, Component } from 'react';
import { Row, Col, ProgressBar, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { technicalFactors, environmentalFactors } from './informations';
import * as apiHelper from '../../helpers/apiHelper';

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      effort_estimation: {},
      technical_factor: {},
      environmental_factor: {},
      features: [],
    };
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get(`/api/effort_estimations/${this.props.params.projectId}`);
      const data = response.data;
      this.setState(data);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { project } = this.props;
    const { effort_estimation, features } = this.state;
    return (
      <DocumentTitle title={`${project.name}・Planning`}>
        <div className="tiein-container">
          <h3 className="header-label">Planning Result</h3>
          <hr className="header-line" />
          <div>
            <p>Most used week: {Math.ceil(effort_estimation.upper_weeks)}</p>
            <p>Low used week: {Math.floor(effort_estimation.lower_weeks)}</p>
            <p>Developer number: {Math.floor(effort_estimation.developers)}</p>
            <ProgressBar now={60} />
            <hr />
          </div>
          <Row>
            <Col sm={6}>
              <h4 className="header-label">Planning Features</h4>
              <hr className="header-line" />
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Feature names</th>
                    <th>Last Name</th>
                  </tr>
                </thead>
                <tbody>
                  { features.map((feature) => {
                    return (<tr>
                      <td>{feature.name}</td>
                      <td>{feature.complexity}</td>
                    </tr>);
                  })
                  }
                </tbody>
              </Table>
            </Col>
            <Col sm={6}>
              <Row>
                <h4 className="header-label">Technical Factors</h4>
                <hr className="header-line" />
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    { technicalFactors.map((factor) => {
                      return (
                        <tr>
                          <td>{factor.name}</td>
                          <td>
                            {this.state.technical_factor[`rating_factor${factor.id}`]}
                          </td>
                        </tr>);
                    })
                    }
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h4 className="header-label">Environmental Factors</h4>
                <hr className="header-line" />
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    { environmentalFactors.map((factor) => {
                      return (
                        <tr>
                          <td>{factor.name}</td>
                          <td>
                            {this.state.environmental_factor[`rating_factor${factor.id}`]}
                          </td>
                        </tr>);
                    })
                    }
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Row>
          <br />
        </div>
      </DocumentTitle>
    );
  }
}

Container.propTypes = {
  params: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

export default connect(mapStateToProps)(Container);
