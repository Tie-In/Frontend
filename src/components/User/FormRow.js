import React, { PropTypes, Component } from 'react';
import {
  FormGroup, Col,
  FormControl, ControlLabel,
} from 'react-bootstrap';

class FormRow extends Component {
  render() {
    const { title, name, error, handleInput, value, type } = this.props;
    return (
      <Col xs={12} sm={6}>
        <FormGroup validationState={error === '' ? null : 'error'}>
          <ControlLabel>{title}</ControlLabel>
          <FormControl
            type={type}
            placeholder={title}
            name={name}
            value={value}
            onChange={(e) => { handleInput(name, e.target.value); }}
          />
          <h6 className="error-label">{error}</h6>
        </FormGroup>
      </Col>
    );
  }
}

FormRow.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default FormRow;
