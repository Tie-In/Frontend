import React, { PropTypes, Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import { technicalFactors, environmentalFactors } from './informations';
import * as projectActionsCreator from '../../actions/project-actions';
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
    const { projectActions, params } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);

      const responseEffort = await apiHelper.get(`/api/effort_estimations/${project.effort_estimation.id}`);
      const data = responseEffort.data;
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
            <p>Most used week: {Math.ceil(effort_estimation.upper_weeks) || '?'} weeks</p>
            <p>Low used week: {Math.floor(effort_estimation.lower_weeks) || '?'} weeks</p>
            <p>Developer number: {Math.floor(effort_estimation.developers) || '?'} people</p>
          </div>
          <Row>
            <Col sm={6}>
              <h4 className="header-label">Planning Features</h4>
              <hr className="header-line" />
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Feature names</th>
                    <th>
                      <center>Complexity</center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { features.map((feature) => {
                    return (
                      <tr key={feature.id}>
                        <td>{feature.name}</td>
                        <td>
                          <center>{feature.complexity}</center>
                        </td>
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
                      <th>
                        <center>Rating</center>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    { technicalFactors.map((factor) => {
                      return (
                        <tr key={factor.id}>
                          <td>{factor.name}</td>
                          <td>
                            <center>
                              {this.state.technical_factor[`rating_factor${factor.id}`] || '?' }
                            </center>
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
                      <th>
                        <center>Rating</center>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    { environmentalFactors.map((factor) => {
                      return (
                        <tr key={factor.id}>
                          <td>{factor.name}</td>
                          <td>
                            <center>
                              {this.state.environmental_factor[`rating_factor${factor.id}`] || '?'}
                            </center>
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
  project: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
