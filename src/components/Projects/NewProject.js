import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl, Glyphicon,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import Autosuggest from 'react-autosuggest';
import * as projectActions from '../../actions/project-actions';
import * as apiHelper from '../../helpers/apiHelper';
import '../../style/autosuggestStyle.css';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.username} ${suggestion.email}`;
}

function renderSuggestion(suggestion) {
  const suggestionText = `${suggestion.username} (${suggestion.email})`;
  return (
    <span className={`suggestion-content ${suggestion.image}`}>
      <span className="name">
        <span>{suggestionText}</span>
      </span>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class NewProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        name: '',
        description: '',
        sprint_duration: 2,
        users: [],
        organization_id: this.props.params.organizationId,
      },
      allUsers: [],
      value: '',
      suggestions: [],
      contributors: [],
    };

    this.create = this.create.bind(this);
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get('/api/users', {
        organization: this.props.params.organizationId,
      });
      const users = response.data;
      this.setState({ allUsers: users });
    } catch (err) {
      console.log(err);
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    if (suggestion !== undefined) {
      const newUsernames = this.state.contributors.slice();
      newUsernames.push(suggestion);

      const newUsers = this.state.input.users.slice();
      newUsers.push({ id: suggestion.id });

      const newInput = this.state.input;
      newInput.users = newUsers;

      this.setState({
        contributors: newUsernames,
        value: '',
        input: newInput,
      });
    }
  }

  getSuggestions(value) {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    if (inputValue === '') {
      return [];
    }
    const availableUsers = this.state.allUsers.diff(this.state.contributors);
    const regex = new RegExp('\\b' + inputValue, 'i');
    return availableUsers.filter(person => regex.test(getSuggestionValue(person)));
  }

  async create() {
    let noError = true;
    if (this.state.input.name === '') {
      noError = false;
      this.setState({ nameError: "Organization's name is required" });
    }
    if (this.state.input.sprint_duration === '') {
      noError = false;
      this.setState({ sprintError: 'Sprint duration is required' });
    }
    if (noError) {
      try {
        const response = await apiHelper.post('/api/projects', {
          project: this.state.input,
        });
        const project = response.data;
        this.props.projectActions.setProject(project);
        document.location.href = `/organizations/${project.organization_id}/projects/${project.id}`;
      } catch (err) {
        const errData = err.response.data.errors;
        if (errData.name) {
          this.setState({ nameError: errData.name });
        }
        console.log(errData);
      }
    }
  }

  removeContributor(id) {
    const array = this.state.contributors;
    const index = array.indexOf(id);
    array.splice(index, 1);

    const users = this.state.input.users;
    const uindex = users.indexOf(id);

    const newInput = this.state.input;
    users.splice(uindex, 1);
    newInput.users = users;

    this.setState({
      contributors: array,
      input: newInput,
    });
  }

  contributor() {
    const content = this.state.contributors.map((contributor) => {
      return (<Row key={contributor.id}>
        <Col smOffset={0} xs={9} md={10}>
          <span className={`suggestion-content ${contributor.image}`}>
            <span className="name">
              <span>{contributor.username}</span>
            </span>
          </span>
        </Col>
        <Col smOffset={0} xs={2} md={2}>
          <Button bsStyle="primary" onClick={() => { this.removeContributor(contributor.id); }}>
            <Glyphicon glyph="remove" />
          </Button>
        </Col>
      </Row>);
    },
    );
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
    const buttonGroup = {
      marginTop: '20px',
    };
    const singleButton = {
      marginTop: '10px',
    };
    const contributorList = {
      height: '200px',
      position: 'relative',

    };
    const scrollableContainer = {
      borderLeft: '1px solid #7E8281',
      position: 'absolute',
      height: '85%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'auto',
    };
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Find user',
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };
    const errorStyle = {
      color: '#d9534f',
      marginLeft: '25px',
    };
    const previousURL = `/organizations/${this.state.input.organizationId}`;

    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <h3 className="header-label">Create new project</h3>
                <hr className="header-line" />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Project&#39;s name
                  </ControlLabel>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                  <h6 style={errorStyle}>{this.state.nameError}</h6>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description (optional)
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of organization" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Sprint duration (weeks)
                  </ControlLabel>
                  <FormControl type="number" min="1" placeholder="Sprint duration (week)" valueLink={linkState(this, 'input.sprint_duration')} />
                  <h6 style={errorStyle}>{this.state.sprintError}</h6>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} mdOffset={2}>
                <FormGroup controlId="formInlineContributor">
                  <ControlLabel>
                    Contributor
                  </ControlLabel>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected}
                  />
                </FormGroup>
              </Col>
              <Col style={contributorList} xs={12} md={4}>
                <ControlLabel style={{ color: 'white' }}>
                  List of contributors
                </ControlLabel>
                <Row style={scrollableContainer}>
                  <Col smOffset={0} sm={11}>
                    {this.contributor()}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <FormGroup style={buttonGroup}>
                <Col xs={12} md={3} xsOffset={0} mdOffset={3}>
                  <Button style={singleButton} bsStyle="primary" href={previousURL} key="cancel" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button style={singleButton} onClick={this.create} key="submitProject" block>
                    Create
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </Form>
        </Grid>
      </div>
    );
  }
}

NewProject.propTypes = {
  projectActions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
