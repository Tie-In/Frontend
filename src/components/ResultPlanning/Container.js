import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Row, Col, ProgressBar, Table } from 'react-bootstrap';
import { technicalFactors, environmentalFactors } from './informations';

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

  componentWillMount() {
    axios({
      method: 'GET',
      url: '/api/effort_estimations/'.concat(this.props.params.projectId),
      headers: {
        Authorization: this.props.user.auth_token,
      },
    }).then((response) => {
      const data = response.data;
      this.setState(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="tieinContainer">
        <h3 className="headerLabel">Planning Result</h3>
        <hr className="headerLine" />
        <div>
          <p>Most used week: {Math.ceil(this.state.effort_estimation.upper_weeks)}</p>
          <p>Low used week: {Math.floor(this.state.effort_estimation.lower_weeks)}</p>
          <p>Developerd number: {Math.floor(this.state.effort_estimation.developers)}</p>
          <ProgressBar now={60} />
          <hr />
        </div>
        <Row>
          <Col sm={6}>
            <h4 className="headerLabel">Planning Features</h4>
            <hr className="headerLine" />
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Feature names</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                { this.state.features.map((feature) => {
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
              <h4 className="headerLabel">Technical Factors</h4>
              <hr className="headerLine" />
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
              <h4 className="headerLabel">Environmental Factors</h4>
              <hr className="headerLine" />
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
    );
  }
}

Container.propTypes = {
  user: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
    project: state.project,
  };
}

export default connect(mapStateToProps)(Container);
