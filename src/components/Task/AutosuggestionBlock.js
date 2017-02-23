import {
  Button, Grid, Col, Row, Form,
  FormGroup, ControlLabel, FormControl, Glyphicon,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import Autosuggest from 'react-autosuggest';
import '../../style/autosuggestStyle.css';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.username || suggestion.name} ${suggestion.email}`;
}

function renderSuggestion(suggestion) {
  const suggestionText = `${suggestion.username || suggestion.name} (${suggestion.email || suggestion.complexity})`;
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

class AutosuggestionBlock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected_id: '',
      allData: [],
      value: '',
      suggestions: [],
      contributors: [],
    };
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
    this.setState({
      suggestions: this.props.data,
    });
    if (suggestion !== undefined) {
      const newUsernames = this.state.contributors.slice();
      newUsernames.push(suggestion);
      this.props.setValue(suggestion.id);
      this.setState({
        selected_id: suggestion.id,
        contributors: newUsernames,
        value: '',
      });
    }
  }

  getSuggestions(value) {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    if (inputValue === '') {
      return [];
    }
    const availableUsers = this.state.allData.diff(this.state.contributors);
    const regex = new RegExp('\\b' + inputValue, 'i');
    return availableUsers.filter(person => regex.test(getSuggestionValue(person)));
  }

  removeContributor() {
    this.setState({
      contributors: [],
      selected_id: '',
    });
    this.onSuggestionsClearRequested();
    this.props.setValue('');
  }

  contributor() {
    const contributor = this.state.contributors[0];
    const content = (
      <Row key={contributor.id}>
        <Col smOffset={0} xs={9} md={10}>
          <span className={`suggestion-content ${contributor.image || ''}`}>
            <span className="name">
              <span>
                {contributor.username || contributor.name} ( {contributor.email || contributor.complexity} )
              </span>
            </span>
          </span>
        </Col>
        <Col smOffset={0} xs={2} md={2}>
          <Button bsStyle="primary" onClick={() => this.removeContributor()}>
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
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };

    return (
      <div>
        <FormGroup controlId="formInlineContributor">
          <ControlLabel>
            {this.props.title}
          </ControlLabel>
          { this.state.contributors.length > 0 ?
            this.contributor() :
            <Autosuggest
              suggestions={suggestions}
              alwaysRenderSuggestions="true"
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={this.onSuggestionSelected}
            />
          }
        </FormGroup>
      </div>
    );
  }
}

AutosuggestionBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default AutosuggestionBlock;
