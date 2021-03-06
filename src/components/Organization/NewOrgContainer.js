import React, { Component, PropTypes } from 'react';
import {
  Button, Col, Row,
  FormGroup, ControlLabel, FormControl, Glyphicon,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'react-addons-update';
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
    <span className="suggestion-content">
      <span> <img src={suggestion.image} alt="profile-pic" /></span>
      <span className="suggestion-user">
        <span>{suggestionText}</span>
      </span>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter((i) => {return a.indexOf(i) < 0;});
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
      nameError: '',
      value: '',
      suggestions: [],
      contributors: [],
    };

    this.create = this.create.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentWillMount() {
    this.props.organizationActions.setOrganization([]);
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
      const newContributors = update(this.state.contributors, { $push: [suggestion] });
      // input user need only id
      const newInput = update(this.state.input, { users: { $push: [{ id: suggestion.id }] } });
      this.setState({
        contributors: newContributors,
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
    const regex = new RegExp(`\\b${inputValue}`, 'i');
    return availableUsers.filter((person) => { return regex.test(getSuggestionValue(person)); });
  }

  async create() {
    let noError = true;
    if (this.state.input.name === '') {
      noError = false;
      this.setState({ nameError: "Organization's name is required" });
    }
    if (noError) {
      try {
        const response = await apiHelper.post('/api/organizations', {
          organization: this.state.input,
        });
        const org = response.data.organization;
        const user = response.data.user;
        this.props.userActions.setUser(user);

        document.location.href = `/organizations/${org.id}`;
      } catch (err) {
        console.log(err.response);
      }
    }
  }

  removeContributor(id) {
    const array = this.state.contributors;
    const index = array.indexOf(array.find((a) => { return a.id === id; }));
    array.splice(index, 1);

    const users = this.state.input.users;
    const uindex = users.indexOf(users.find((a) => { return a.id === id; }));

    const newInput = this.state.input;
    users.splice(uindex, 1);
    newInput.users = users;
    this.setState({
      contributors: array,
      input: newInput,
    });
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      input: update(this.state.input, {
        [name]: { $set: value },
      }),
    });
  }

  contributor() {
    const content = this.state.contributors.map((contributor) => {
      return (<Row key={contributor.id}>
        <Col smOffset={0} xs={9} md={10}>
          <span className="suggestion-content">
            <span> <img src={contributor.image} alt="profile-pic" /></span>
            <span className="suggestion-user">
              <span>{contributor.username} ({contributor.email})</span>
            </span>
          </span>
        </Col>
        <Col smOffset={0} xs={2} md={2}>
          <Button bsStyle="primary" onClick={() => { this.removeContributor(contributor.id); }}>
            <Glyphicon glyph="remove" />
          </Button>
        </Col>
      </Row>);
    });
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
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

    return (
      <div className="tiein-container">
        <h3 className="header-label">Create new organization</h3>
        <hr className="header-line" />
        <form>
          <Row>
            <Col xs={12}>
              <FormGroup validationState={this.state.nameError === '' ? null : 'error'}>
                <ControlLabel>
                  Organization&#39;s name
                </ControlLabel>
                <FormControl
                  type="text" placeholder="Name"
                  name="name"
                  onChange={this.handleInputChange}
                />
                <h6 style={errorStyle}>{this.state.nameError}</h6>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup controlId="formInlineDetail">
                <ControlLabel>
                  Description (optional)
                </ControlLabel>
                <FormControl
                  type="text" placeholder="Description of organization"
                  name="description"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
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
            <Col style={contributorList} xs={6}>
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
          <br />
          <Row>
            <FormGroup>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
                <Button bsStyle="primary" href="/" key="cancel" block>
                  Cancel
                </Button>
              </Col>
              <Col xs={12} md={4}>
                <Button onClick={this.create} key="submit" block>
                  Create
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </form>
      </div>
    );
  }
}

NewOrgContainer.propTypes = {
  userActions: PropTypes.object.isRequired,
  organizationActions: PropTypes.object.isRequired,
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
