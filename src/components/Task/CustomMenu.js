import React, { PropTypes } from 'react';
import {
  Button,
  FormGroup, FormControl,
} from 'react-bootstrap';
import WrapperColorpicker from './WrapperColorpicker';
import * as apiHelper from '../../helpers/apiHelper';
import '../../style/autosuggestStyle.css';

class CustomMenu extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = (e) => { this.setState({ value: e.target.value }); };

    this.state = { value: '' };
    this.selectColor = this.selectColor.bind(this);
    this.createTag = this.createTag.bind(this);
  }

  selectColor(colorHex) {
    this.color = colorHex;
  }

  async createTag() {
    const newTag = {
      name: this.state.value,
      color: this.color,
      project_id: this.props.projectId,
    };
    const response = await apiHelper.post('/api/tags', newTag);
    this.props.addTag(response.data);
    this.setState({
      value: '',
    });
    this.color = '';
  }

  focusNext() {
    const input = ReactDOM.findDOMNode(this.input);

    if (input) {
      input.focus();
    }
  }

  render() {
    return (
      <div className="dropdown-menu" style={{ padding: '5px' }}>
        <FormGroup>
          <FormControl
            type="text" placeholder="Tag name"
            ref={(c) => { this.input = c; }}
            onClick={this.inputClick}
            name="newName"
            onChange={this.onChange}
            value={this.state.value}
          />
        </FormGroup>
        <WrapperColorpicker setColor={this.selectColor} />
        <br />
        <Button onClick={this.createTag}>Create</Button>
      </div>
    );
  }
}

CustomMenu.propTypes = {
  addTag: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default CustomMenu;
