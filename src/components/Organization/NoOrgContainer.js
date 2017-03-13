import { Image, Button } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class NoOrgContainer extends Component {
  componentWillMount() {
    if (this.props.user.organizations.length > 0) {
      const firstOrg = this.props.user.organizations[0];
      document.location.href = `/organizations/${firstOrg.id}`;
    }
  }

  render() {
    const articleStyles = {
      margin: '0 auto',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    const buttonDefaultStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
      // marginTop: '8px',
    };
    const pStyle = {
      margin: '0 0 0',
    };
    return (
      <div style={articleStyles}>
        <a href="/organizations/new">
          <Image src={'src/images/add-org.png'} alt="Image" />
        </a>
        <p style={pStyle} />
        <Button href="/organizations/new" style={buttonDefaultStyle}>Create new organization</Button>
      </div>
    );
  }
}

NoOrgContainer.propTypes = {
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(NoOrgContainer);
