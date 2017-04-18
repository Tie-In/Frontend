import React, { PropTypes, Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

function logout() {
  localStorage.clear();
  document.location.href = '/login';
}

class DropdownUser extends Component {

  render() {
    const { user } = this.props;

    return (
      <Dropdown className="pull-right" id="profile-dropdown" style={{ width: 75 }}>
        <Dropdown.Toggle>
          <img
            id="avatar" role="presentation"
            src={user.image}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem disabled>
            {user.username}<br />
            {user.email}
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="1" href={'/profile'}>Profile</MenuItem>
          <MenuItem eventKey="2" onClick={() => { logout(); }} >Sign Out</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

DropdownUser.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DropdownUser;
