import React, { Component, PropTypes } from 'react';
import {
  Button, Col, Row,
  FormGroup, ControlLabel, Glyphicon, Label,
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import '../../style/autosuggestStyle.css';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.name}`;
}

function renderSuggestion(suggestion) {
  return (
    <span className="suggestion-content">
      <span>{suggestion.name}</span>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class TagRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
      value: '',
      suggestions: [],
      selected: [],
      isShow: true,
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
    if (suggestion !== undefined) {
      const selectedTemp = this.state.selected.slice();
      const resultTemp = this.state.result.slice();
      selectedTemp.push(suggestion);
      resultTemp.push({ id: suggestion.id });

      this.setState({
        selected: selectedTemp,
        value: '',
        users: resultTemp,
        isShow: false,
      });
    } else {
      this.setState({
        suggestions: this.getSuggestions(''),
        isShow: true,
      });
    }
  }

  getSuggestions(value) {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    if (value === '') {
      return this.props.data.diff(this.state.selected);
    }
    const availableUsers = this.props.data.diff(this.state.selected);
    const regex = new RegExp('\\b' + inputValue, 'i');
    return availableUsers.filter(person => regex.test(getSuggestionValue(person)));
  }

  removeContributor(con) {
    const tempSelected = this.state.selected;
    tempSelected.splice(tempSelected.indexOf(con), 1);

    const tempResult = this.state.result;
    tempResult.splice(tempResult.indexOf({ id: con.id }), 1);

    this.setState({
      selected: tempSelected,
      users: tempResult,
      value: '',
    });
  }

  result() {
    const contentArr = [];
    this.state.selected.map((tag) => {
      const labelStyle = {
        backgroundColor: tag.color,
        color: 'white',
        marginRight: 10,
      };
      const glyphStyle = {
        marginLeft: 5,
      };
      const label = (
        <Label key={tag.id} style={labelStyle}>
          {tag.name}
          <Glyphicon
            glyph="remove" style={glyphStyle}
            onClick={() => this.removeContributor(tag)}
          />
        </Label>
      );
      contentArr.push(label);
    },
    );
    return (
      <div>
        <h4>
          {contentArr}
        </h4>
      </div>
    );
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Find user',
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };

    return (
      <div>
        <Col xs={12} md={2} mdOffset={2}>
          <FormGroup controlId="formInlineContributor">
            <ControlLabel>
              Add Tags
            </ControlLabel>
            <Autosuggest
              suggestions={suggestions}
              alwaysRenderSuggestions={this.state.isShow}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={this.onSuggestionSelected}
            />
          </FormGroup>
        </Col>
        <Col xs={4} md={2}>
          <Button bsStyle="primary" style={{ marginTop: 25 }}>New tag</Button>
        </Col>
        <Col xs={12} md={4}>
          <ControlLabel style={{ color: 'white' }}>
            List of contributors
          </ControlLabel>
          <Row>
            <Col smOffset={0} sm={11}>
              {this.result()}
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

TagRow.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TagRow;
