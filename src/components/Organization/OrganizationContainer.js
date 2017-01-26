import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NoOrgContainer from './NoOrgContainer';

class OrganizationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org: '',
    };
  }

  render() {
    console.log(this.props.user);
    return (
      <div>
        <NoOrgContainer />
      </div>
    );
  }
}

OrganizationContainer.propTypes = {
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(OrganizationContainer);
