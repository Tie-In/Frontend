import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';
import linkState from 'react-link-state';

export default class NewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      click: false,
      name: '',
    };

    this.clickNew = this.clickNew.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    if (this.state.name !== '') {
      this.props.createList(this.state.name);
    }
    this.setState({
      click: false,
      name: '',
    });
  }

  clickNew() {
    this.setState({ click: true });
  }

  render() {
    const inputStyle = {
      width: '80%',
      marginRight: '10%',
    };
    return (
      <div className="desk-new" onClick={this.clickNew}>
        <div className="desk-head">
          { this.state.click ?
            <div>
              <input
                style={inputStyle} type="text"
                valueLink={linkState(this, 'name')} autoFocus="true"
                onBlur={this.onBlur}
              />
              <Glyphicon glyph="remove" />
            </div>
          :
            <div className="desk-name">
              <Glyphicon glyph="plus" /> Add new list
            </div>
          }
        </div>
      </div>
    );
  }
}
