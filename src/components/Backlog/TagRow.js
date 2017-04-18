import React, { Component, PropTypes } from 'react';
import {
  Col, Row,
  ControlLabel, Glyphicon, Label,
} from 'react-bootstrap';
import update from 'react-addons-update';
import Autosuggest from 'react-autosuggest';
import '../../style/autosuggestStyle.css';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.name}`;
}

function renderSuggestion(suggestion) {
  const canvasStyle = {
    backgroundColor: suggestion.color,
  };
  return (
    <span className="suggestion-content">
      <Row>
        <Col xs={2}>
          <canvas width="15" height="15" style={canvasStyle} />
        </Col>
        <Col xs={6}>
          <span>{suggestion.name}</span>
        </Col>
      </Row>
    </span>
  );
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) { return a.indexOf(i) < 0; });
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
      openDropdown: false,
      newName: '',
    };

    this.inputClick = this.inputClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    if (this.props.initSelect) {
      const idArr = [];
      this.props.initSelect.forEach((tag) => {
        idArr.push({ id: tag.id });
      });
      this.setState({
        selected: this.props.initSelect,
        result: idArr,
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
    if (suggestion !== undefined) {
      const selectedTemp = this.state.selected.slice();
      const resultTemp = this.state.result.slice();
      selectedTemp.push(suggestion);
      resultTemp.push({ id: suggestion.id });

      this.setState({
        selected: selectedTemp,
        value: '',
        result: resultTemp,
        isShow: false,
      });
      this.props.setValue(resultTemp);
    } else {
      this.setState({
        suggestions: this.getSuggestions(''),
        isShow: true,
      });
    }
  }

  getSuggestions(value) {
    const inputValue = escapeRegexCharacters(value.trim().toLowerCase());
    const onlyId = this.state.selected.map((s) => { return s.id; });
    const availableUsers = this.props.data.filter((data) => {
      return onlyId.indexOf(data.id) < 0;
    });
    if (value === '') {
      return availableUsers;
    }
    const regex = new RegExp('\\b' + inputValue, 'i');
    return availableUsers.filter(person => regex.test(getSuggestionValue(person)));
  }

  removeContributor(con) {
    const tempSelected = this.state.selected;
    tempSelected.splice(tempSelected.indexOf(con), 1);

    const tempResult = this.state.result;
    tempResult.splice(tempResult.indexOf(tempResult.find((a) => { return a.id === con.id; })), 1);

    this.setState({
      selected: tempSelected,
      users: tempResult,
      value: '',
    });
    this.props.setValue(tempResult);
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

  inputClick(e) {
    this.setState({ openDropdown: true });
  }

  handleInputChange(e) {
    const name = e.target.name;
    this.setState({ input: update(this.state.input, { [name]: { $set: e.target.value } }) });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Select tag',
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };

    return (
      <div>
        <Col xs={3} componentClass={ControlLabel}>
          Tags
        </Col>
        <Col xs={9}>
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
        </Col>
        <Col xs={7} xsOffset={3}>
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
  setValue: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
  initSelect: PropTypes.arrayOf(PropTypes.object),
};

export default TagRow;
