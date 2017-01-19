import {
  Row, FormGroup, Col, Button, FormControl,
  ControlLabel, InputGroup,
  Glyphicon, Media, Image,
} from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import linkState from 'react-link-state';
import axios from 'axios';
import logo from '../../images/logo-login.png';

class NewProject extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: {
        name: '',
        description: '',
      },
    };

    this.create = this.create.bind(this);
  }

  create() {
    // if (pass && this.state.input.password === this.state.input.password_confirmation) {
    //   axios.post('/api/users', {
    //     user: this.state.input,
    //   }).then((response) => {
    //     this.props.actions.setUser(response.data);
    //     // go next
    //   }).catch((error) => {
    //     console.log(error.response.data);
    //     const err = error.response.data.errors;
    //     const errState = this.state.error;
    //     if (err.email.length > 0) {
    //       errState.email = err.email[0];
    //     }
    //   });
    // }
  }

  render() {
    const containerStyle = {
      width: '70%',
      height: 'auto',
      right: '50%',
      transform: 'translate(50%)',
      position: 'absolute',
    };
    const headerStyle = {
      color: '#A25E5D',
    };
    const lineColor = {
      borderColor: 'black',
    };
    const scrollableContainer = {
      marginTop: '25px',
      borderLeft: 'solid 1px',
      height: '200px',
      widht: 'auto',
      overflowY: 'scroll',
      overflowX: 'hidden',
    };
    const userButton = {
      border: 'none',
    };
    return (
      <div style={containerStyle}>
        <h3 style={headerStyle}>Create new project</h3>
        <hr style={lineColor} />
        <form>
          <Row>
            <Col sm={10}>
              <FormGroup>
                <ControlLabel>Project name</ControlLabel>
                <FormControl
                  placeholder="Name"
                  valueLink={linkState(this, 'input.name')}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  placeholder="Description"
                  valueLink={linkState(this, 'input.description')}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <ControlLabel>Sprint duration (week)</ControlLabel>
                <FormControl
                  placeholder="Duration"
                  type="number"
                  valueLink={linkState(this, 'input.duration')}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <h5>Contributor</h5>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    placeholder="Find user"
                    valueLink={linkState(this, 'input.duration')}
                  />
                  <InputGroup.Addon>
                    <Glyphicon glyph="plus" />
                  </InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm={5}>
              <div style={scrollableContainer}>
                <Button bsStyle="primary" style={userButton}>
                  <Row>
                    <Col smOffset={1} sm={10}>
                      <Media>
                        <Media.Left>
                          <Image width={32} height={32} src={logo} alt="user" circle />
                        </Media.Left>
                        <Media.Body>
                          <p>pongsachon.p@ku.th</p>
                        </Media.Body>
                      </Media>
                    </Col>
                  </Row>
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <FormGroup>
              <Col smOffset={2} sm={4}>
                <Button
                  bsStyle="primary"
                  block
                >
                  Cancel
                </Button>
              </Col>
              <Col sm={4}>
                <Button
                  block
                >
                  Create
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </form>
      </div>
    );
  }
}

// Register.propTypes = {
//   user: PropTypes.object.isRequired,
//   actions: PropTypes.object.isRequired,
// };
//
// function mapStateToProps(state) {
//   return {
//     user: state.user,
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(userActions, dispatch),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
export default NewProject;
