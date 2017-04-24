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
      categories: [],
      category: {
        name: '',
        color: '',
      },
      colors: ['#FCB900', '#8ED1FC', '#FF6900', '#cddc39', '#F78DA7', '#00D084',
        '#0693E3', '#ABB8C3', '#9900EF', '#795548', '#EB144C', '#697689'],
    };
    this.addCategories = this.addCategories.bind(this);
    this.sendCategories = this.sendCategories.bind(this);
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

  addCategories(categories) {
    const cats = [];
    categories.forEach((category, index) => {
      cats.push({ name: category, color: this.state.colors[index] });
    });
    this.setState({ categories: cats });
  }

  async sendCategories() {
    // try {
    //   const res = await apiHelper.post('/api/viewpoint_categories', {
    //     viewpoint_categories: this.state.categories,
    //     retrospective_id: this.state.sprints[this.state.sprints.length - 1].retrospective.id,
    //   });
    //   console.log(res);
    // } catch (err) {
    //   console.log(err.response);
    // }
    document.location.href = `/organizations/${this.props.organization.id}/projects/${this.props.project.id}/retrospective/management/important`;
  }

  setComment(color, id) {
    console.log(`${id} ${color}`);
  }

  render() {
    console.log(this.state.categories);
    const comments = (kind) => {
      if (this.state.viewpoints) {
        return this.state.viewpoints.map((data) => {
          if (data.kind === kind) {
            return (<Comment
              key={data.id}
              comment={data.comment}
              categories={this.state.categories}
              setComment={this.setComment}
              commentID={data.id}
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
            <Col sm={12}>
              <Categories
                id="cat"
                colors={this.state.colors}
                sprint={this.state.sprints[this.state.sprints.length - 1]}
                addCategories={this.addCategories}
              />
            </Col>
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
          <div id="nextBtn"><Button onClick={this.sendCategories}>
            Next
          </Button></div>
        </div>
      </DocumentTitle>
    );
  }
}

Management.propTypes = {
  project: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
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
