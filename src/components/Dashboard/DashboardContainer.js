import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Line } from 'react-chartjs-2';
import { Grid, Row, Col } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import * as apiHelper from '../../helpers/apiHelper';
import * as projectActionsCreator from '../../actions/project-actions';

class DashboardContainer extends Component {

  async componentWillMount() {
    const { params, projectActions } = this.props;
    try {
      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    // const data = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [{
    //     label: 'Sales',
    //     type: 'line',
    //     data: [51, 65, 40, 49, 60, 37, 40],
    //     fill: false,
    //     borderColor: '#EC932F',
    //     backgroundColor: '#EC932F',
    //     pointBorderColor: '#EC932F',
    //     pointBackgroundColor: '#EC932F',
    //     pointHoverBackgroundColor: '#EC932F',
    //     pointHoverBorderColor: '#EC932F',
    //     yAxisID: 'y-axis-2',
    //   },
    //   {
    //     type: 'bar',
    //     label: 'Visitor',
    //     data: [200, 185, 590, 621, 250, 400, 95],
    //     fill: false,
    //     backgroundColor: '#71B37C',
    //     borderColor: '#71B37C',
    //     hoverBackgroundColor: '#71B37C',
    //     hoverBorderColor: '#71B37C',
    //     yAxisID: 'y-axis-1',
    //   }],
    // };
    const { project } = this.props;
    console.log(project);
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        type: 'line',
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        type: 'line',
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90],
      }],
    };

    const options = {
      responsive: true,
      // bezierCurve: false,
      tooltips: {
        mode: 'label',
      },
      elements: {
        line: {
          // fill: false,
          tension: 0,
        },
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
          },
        ],
        yAxes: [
          {
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            gridLines: {
              display: false,
            },
            labels: {
              show: true,
            },
          },
          // {
          //   type: 'linear',
          //   display: true,
          //   position: 'right',
          //   id: 'y-axis-2',
          //   gridLines: {
          //     display: false,
          //   },
          //   labels: {
          //     show: true,
          //   },
          // },
        ],
      },
    };
    return (
      <DocumentTitle title={`${project.name}・Dashboard`}>
        <div className="tiein-container">
          <Grid>
            <h2>Mixed data Example</h2>
            <Row className="show-grid">
              <Col xs={12} md={8}>
                <Line
                  data={data}
                  options={options}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

DashboardContainer.propTypes = {
  project: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
