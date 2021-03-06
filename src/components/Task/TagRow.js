import React, { Component, PropTypes } from 'react';
import {
  Button, Col, Row,
  FormGroup, ControlLabel, Glyphicon, Label, Dropdown,
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import CustomMenu from './CustomMenu';
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
      data: [],
    };

    this.color = '';
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setNewTag = this.setNewTag.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
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
    const regex = new RegExp(`\\b${inputValue}`, 'i');
    return availableUsers.filter((person) => { return regex.test(getSuggestionValue(person)); });
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

  toggleDropdown() {
    this.setState({ openDropdown: !this.state.openDropdown });
  }

  setNewTag(tag) {
    const temp = this.state.selected;
    const resultTemp = this.state.result;
    temp.push(tag);
    resultTemp.push({ id: tag.id });
    this.props.setValue(resultTemp);
    this.setState({
      openDropdown: false,
      selected: temp,
      result: resultTemp,
    });
  }

  handleInputChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value,
    });
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
        <Col xs={12} md={4}>
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
          <Dropdown id="NewTagInNewTask" dropup>
            <div bsRole="toggle">
              <Button
                onClick={this.toggleDropdown}
                bsStyle="primary"
                style={{ marginTop: 25 }}
              >
                New tag
              </Button>
            </div>
            <CustomMenu bsRole="menu" projectId={this.props.projectId} addTag={this.setNewTag} />
          </Dropdown>
        </Col>
        <Col xs={12} md={4}>
          <ControlLabel />
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
  projectId: PropTypes.string.isRequired,
};

export default TagRow;
