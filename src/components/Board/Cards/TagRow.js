import React, { Component, PropTypes } from 'react';
import {
  Button, Col, Row,
  FormGroup, ControlLabel, Glyphicon, Label, Dropdown, FormControl,
} from 'react-bootstrap';
import update from 'react-addons-update';
import Autosuggest from 'react-autosuggest';
import WrapperColorpicker from './WrapperColorpicker';
import * as apiHelper from '../../../helpers/apiHelper';
import '../../../style/autosuggestStyle.css';

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

    this.color = '';
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.inputClick = this.inputClick.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.createTag = this.createTag.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    if (this.props.initSelect) {
      const idArr = [];
      const arr = [];
      this.props.initSelect.map((tag) => {
        idArr.push({ id: tag.id });
        this.props.data.map((data) => {
          if (tag.id === data.id) {
            arr.push(data);
          }
        });
      });
      this.setState({
        selected: arr,
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

  toggleDropdown() {
    this.setState({ openDropdown: !this.state.openDropdown });
  }

  selectColor(colorHex) {
    this.color = colorHex;
  }

  async createTag() {
    const newTag = {
      name: this.state.newName,
      color: this.color,
      project_id: this.props.projectId,
    };
    const temp = this.state.selected;
    const resultTemp = this.state.result;
    const response = await apiHelper.post('/api/tags', newTag);
    temp.push(response.data);
    resultTemp.push({ id: response.data.id });
    this.props.setValue(resultTemp);
    this.setState({
      openDropdown: false,
      selected: temp,
      newName: '',
      result: resultTemp,
    });
    this.color = '';
  }

  handleInputChange(e) {
    const name = e.target.name;
    this.setState({ input: update(this.state.input, { [name]: { $set: e.target.value } }) });
  }

  render() {
    const { value, suggestions, openDropdown } = this.state;
    const inputProps = {
      placeholder: 'Select tag',
      value,
      onChange: this.onChange,
      onClick: this.onSuggestionSelected,
    };
    const menuStyle = {
      padding: '5px 5px 5px 5px',
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
        <Col xs={2} xsOffset={3}>
          <Dropdown id="tagsDropdown" open={openDropdown} dropup>
            <div bsRole="toggle">
              <Button
                onClick={this.toggleDropdown}
                bsStyle="primary"
                style={{ marginTop: 25 }}
              >
                New tag
              </Button>
            </div>
            <div className="dropdown-menu" style={menuStyle} bsRole="menu">
              <FormGroup>
                <FormControl
                  type="text" placeholder="Tag name"
                  name="newName"
                  value={this.state.newName}
                  onClick={this.inputClick}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <WrapperColorpicker setColor={this.selectColor} />
              <br />
              <Button onClick={this.createTag}>Create</Button>
            </div>
          </Dropdown>
        </Col>
        <Col xs={7}>
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
  projectId: PropTypes.number.isRequired,
  initSelect: PropTypes.arrayOf(PropTypes.object),
};

export default TagRow;
