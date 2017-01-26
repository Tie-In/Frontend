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
    const { user } = this.props;
    return (
      <div>
        { user.organizations.length > 0 ?
          <NoOrgContainer />
        :
          <h3>Have Organization</h3>
        }
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
