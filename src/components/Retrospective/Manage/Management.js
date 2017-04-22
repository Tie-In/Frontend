import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import Comment from './Comment';
import Categories from './Categories';
import * as projectActionsCreator from '../../../actions/project-actions';
import * as permissionActionsCreator from '../../../actions/permission-actions';
import * as apiHelper from '../../../helpers/apiHelper';
import '../retrospective.css';

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprints: this.props.project.sprints,
      viewpoints: [],
    };
  }

  async componentWillMount() {
    const { params, projectActions } = this.props;
    const selectedSprint = this.state.sprints[this.state.sprints.length - 1];
    try {
      const res = await apiHelper.get(`/api/retrospectives/${selectedSprint.retrospective.id}`);
      this.setState({ viewpoints: res.data.viewpoints });

      const response = await apiHelper.get(`/api/projects/${params.projectId}`);
      const project = response.data;
      projectActions.setProject(project);

      console.log(this.state.viewpoints);
    } catch (err) {
      console.log(err);
    }
    console.log(selectedSprint.retrospective);
  }

  render() {
    const colors = ['#FCB900', '#8ED1FC', '#FF6900', '#cddc39', '#F78DA7', '#00D084',
      '#0693E3', '#ABB8C3', '#9900EF', '#795548', '#EB144C', '#697689'];
    const comments = (kind) => {
      if (this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          const index = this.state.viewpoints.indexOf(data);
          if (data.kind === kind) {
            return (<Comment
              key={index}
              comment={data.comment}
              colors={colors}
            />);
          }
        });
      }
    };

    return (
      <DocumentTitle title={`${this.props.project.name}・Retrospective`}>
        <div className="tiein-container">
          <h3 className="header-label">Retrospective management</h3>
          <hr className="header-line" />

          <Row id="addCatRow">
            <Col sm={12}><Categories id="cat" colors={colors} /></Col>
          </Row>
          <Row>
            <Col sm={12}>
              <h4 className="header-label">Good</h4>
              {comments('good')}
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <h4 className="header-label">Bad</h4>
              {comments('bad')}
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <h4 className="header-label">Try</h4>
              {comments('try')}
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    );
  }
}

Management.propTypes = {
  project: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActionsCreator, dispatch),
    permissionActions: bindActionCreators(permissionActionsCreator, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Management);
