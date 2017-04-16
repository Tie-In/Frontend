import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Row, Col,
  Nav, NavItem, Glyphicon,
} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import UserProfile from './Profile/UserProfile';
import * as userActions from '../../actions/user-actions';
import * as apiHelper from '../../helpers/apiHelper';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
    };

    this.updateProfile = this.updateProfile.bind(this);
  }

  async updateProfile(input) {
    try {
      const response = await apiHelper.put(`/api/users/${this.props.user.id}`, {
        user: input,
      });
      const user = response.data;
      this.props.userActions.setUser(user);
      return null;
    } catch (err) {
      return err.response.data.errors;
    }
  }

  render() {
    const { tabIndex } = this.state;
    const { user } = this.props;
    const switchRender = (tab) => {
      if (tab === 1) {
        return (<UserProfile user={user} update={this.updateProfile} />);
      } else if (tab === 2) {
        return (
          <div />
        );
      }
      return <div />;
    };

    return (
      <DocumentTitle title="Profile">
        <div className="tiein-container">
          <h3 className="header-label">Profile</h3>
          <hr className="header-line" />
          <Row>
            <Col xs={12}>
              <Nav bsStyle="tabs" activeKey={tabIndex} onSelect={this.handleSelect}>
                <NavItem eventKey={1}><Glyphicon glyph="user" /> Profile</NavItem>
                <NavItem eventKey={2}><Glyphicon glyph="lock" /> Password</NavItem>
              </Nav>
            </Col>
          </Row>
          <br />
          {switchRender(tabIndex)}
        </div>
      </DocumentTitle>
    );
  }
}

Profile.propTypes = {
  userActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
