import React, { Component, PropTypes } from 'react';
import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl, Glyphicon,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import Autosuggest from 'react-autosuggest';
import * as organizationActions from '../../actions/organization-actions';
import * as userActions from '../../actions/user-actions';
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
    <span className={`suggestion-content${suggestion.image}`}>
      <span className="name">
        <span>{suggestionText}</span>
      </span>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class NewOrgContainer extends Component {
  constructor() {
    super();

    this.state = {
      allUsers: [],
      input: {
        name: '',
        description: '',
        users: [],
      },
      value: '',
      suggestions: [],
      contributors: [],
    };

    this.create = this.create.bind(this);
  }

  async componentWillMount() {
    try {
      const response = await apiHelper.get('/api/users');
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
    try {
      const response = await apiHelper.post('/api/organizations', {
        organization: this.state.input,
      });
      const org = response.data.organization;
      const user = response.data.user;
      this.props.organizationActions.setOrganization(org);
      this.props.userActions.setUser(user);
      document.location.href = `/organizations/${org.id}`;
    } catch (err) {
      console.log(err.response);
    }
  }

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
      const newUsers = this.state.input.users.slice();
      newUsernames.push(suggestion);
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
    const content = this.state.contributors.map((contributor) =>
      <Row key={contributor.id}>
        <Col smOffset={0} xs={9} md={10}>
          <span className={`suggestion-content ${contributor.image}`}>
            <span className="name">
              <span>{contributor.username}</span>
            </span>
          </span>
        </Col>
        <Col smOffset={0} xs={2} md={2}>
          <Button bsStyle="primary" onClick={() => this.removeContributor(contributor.id)}>
            <Glyphicon glyph="remove" />
          </Button>
        </Col>
      </Row>
    );
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
    const lineColor = {
      borderColor: '#7E8281',
    };
    const titleColor = {
      color: '#A25E5D',
    };
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

    return (
      <div>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <h3 style={titleColor}>Create new organization</h3>
                <hr style={lineColor} />
                <FormGroup controlId="formInlineName">
                  <ControlLabel>
                    Organization&#39;s name
                  </ControlLabel>
                  <FormControl type="text" placeholder="Name" valueLink={linkState(this, 'input.name')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of organization" valueLink={linkState(this, 'input.description')} />
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
                  <Button style={singleButton} bsStyle="primary" href="/" key="cancel" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button style={singleButton} onClick={this.create} key="submit" block>
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

NewOrgContainer.propTypes = {
  organizationActions: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    organizationActions: bindActionCreators(organizationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgContainer);
