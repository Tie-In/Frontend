import {
  Button, Col, Row, Glyphicon,
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
    <span className="suggestion-content">
      { suggestion.username ? <span> <img src={suggestion.image} alt="profile-pic" /></span> : <span /> }
      <span className={suggestion.username ? 'suggestion-user' : 'suggestion-feature'}>
        <span>{suggestionText}</span>
      </span>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter((i) => {return a.indexOf(i) < 0;});
};

class AutosuggestionBlock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected_id: '',
      value: '',
      suggestions: [],
      result: {},
    };
  }

  componentWillMount() {
    if (this.props.initSelect) {
      this.setState({
        selected_id: this.props.initSelect.id,
        result: this.props.initSelect,
      });
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
    this.setState({
      suggestions: this.props.data,
    });
    if (suggestion !== undefined) {
      this.props.setValue(suggestion.id);
      this.setState({
        selected_id: suggestion.id,
        result: suggestion,
        value: '',
      });
    }
  }

  getSuggestions(value) {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    if (inputValue === '') {
      return [];
    }
    const regex = new RegExp('\\b' + inputValue, 'i');
    return this.props.data.filter(person => regex.test(getSuggestionValue(person)));
  }

  removeResult() {
    this.setState({
      result: {},
      selected_id: '',
    });
    this.onSuggestionsClearRequested();
    this.props.setValue('');
  }

  result() {
    const { result } = this.state;
    const resultText = `${result.username || result.name} (${result.email || result.complexity})`;
    const content = (
      <Row key={result.id}>
        <Col smOffset={0} xs={9} md={10}>
          <span className="suggestion-content">
            { result.username ? <span> <img src={result.image} alt="profile-pic" /></span> : <span /> }
            <span className={result.username ? 'suggestion-user' : 'suggestion-feature'}>
              <span>{resultText}</span>
            </span>
          </span>
        </Col>
        <Col smOffset={0} xs={2} md={2}>
          <Button bsStyle="primary" onClick={() => this.removeResult()}>
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
        { this.state.result.id !== undefined ?
          this.result() :
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={this.onSuggestionSelected}
            alwaysRenderSuggestions
          />
        }
      </div>
    );
  }
}

AutosuggestionBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setValue: PropTypes.func.isRequired,
  initSelect: PropTypes.object,
};

export default AutosuggestionBlock;
