import React, { Component, PropTypes } from 'react';
import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl,
  InputGroup, Glyphicon, Media, Image,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import * as organizationActions from '../../actions/organization-actions';
import * as userActions from '../../actions/user-actions';
import autosuggestStyle from '../../style/autosuggestStyle.css';

const people = [
  {
    first: 'Charlie',
    last: 'Brown',
    id: '1',
    twitter: 'user'.concat(Math.ceil(Math.random() * 4)),
  },
  {
    first: 'Charlotte',
    last: 'White',
    id: '2',
    twitter: 'user'.concat(Math.ceil(Math.random() * 4)),
  },
  {
    first: 'Chloe',
    last: 'Jones',
    id: '3',
    twitter: 'user'.concat(Math.ceil(Math.random() * 4)),
  },
  {
    first: 'Cooper',
    last: 'King',
    id: '4',
    twitter: 'user'.concat(Math.ceil(Math.random() * 4)),
  },
];

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.first} ${suggestion.last}`;
}

function renderSuggestion(suggestion) {
  const suggestionText = `${suggestion.first} ${suggestion.last}`
  return (
    <span className={'suggestion-content ' + suggestion.twitter}>
      <span className="name">
        <span>{suggestionText}</span>
      </span>
    </span>
  );
}

function getSuggestions(value) {
  const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
  if (inputValue === '') {
    return [];
  }
  const regex = new RegExp('\\b' + inputValue, 'i');
  return people.filter(person => regex.test(getSuggestionValue(person)));
}

// function onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
//   console.log(suggestionValue);
//   const parent = document.getElementsByClassName("react-autosuggest__container");
// }

class NewOrgContainer extends Component {
  constructor() {
    super();

    this.state = {
      input: {
        name: '',
        description: '',
        users: [
          {
            id: 2,
          },
        ],
      },
      value: '',
      suggestions: [],
      usernames: [],
    };

    this.create = this.create.bind(this);
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    if (suggestion !== undefined) {
      const newUsernames = this.state.usernames.slice();
      const newUsers = this.state.input.users.slice();
      newUsernames.push(suggestion);
      newUsers.push({ id: suggestion.id });

      this.setState({
        usernames: newUsernames,
        value: '',
        input: { users: newUsers },
      });
    }
  }

  create() {
    axios({
      method: 'POST',
      url: '/api/organizations',
      headers: {
        Authorization: this.props.user.auth_token,
      },
      data: {
        organization: this.state.input,
      },
    }).then((response) => {
      const org = response.data.organization;
      const user = response.data.user;
      this.props.organizationActions.setOrganization(org);
      this.props.userActions.setUser(user);
      document.location.href = `/organizations/${org.id}`;
    }).catch((error) => {
      console.log(error.response);
    });
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
      width: 'auto',
      overflowY: 'hidden',
      overflowX: 'hidden',
    };
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Find user',
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };

    return (
      <div style={autosuggestStyle}>
        <Grid>
          <Form>
            <Row>
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
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
              <Col xs={12} md={8} xsOffset={0} mdOffset={2}>
                <FormGroup controlId="formInlineDetail">
                  <ControlLabel>
                    Description
                  </ControlLabel>
                  <FormControl type="text" placeholder="Description of organization" valueLink={linkState(this, 'input.description')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} xsOffset={0} mdOffset={2}>
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
                    <Media>
                      <Media.Left>
                        <Image width={32} height={32} src="src/images/logo-login.png" alt="user" circle />
                      </Media.Left>
                      <Media.Body>
                        <p>pongsachon.p@ku.th</p>
                      </Media.Body>
                    </Media>
                    <Media>
                      <Media.Left>
                        <Image width={32} height={32} src="src/images/logo-login.png" alt="user" circle />
                      </Media.Left>
                      <Media.Body>
                        <p>pongsachon.p@ku.th</p>
                      </Media.Body>
                    </Media>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <FormGroup style={buttonGroup}>
                <Col xs={12} md={3} xsOffset={0} mdOffset={3}>
                  <Button style={singleButton} bsStyle="primary" href="/no-organization" block>
                    Cancel
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button style={singleButton} onClick={this.create} block>
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
  user: PropTypes.object.isRequired,
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
