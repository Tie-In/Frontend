import React, { PropTypes, Component } from 'react';
import { ResponsiveEmbed } from 'react-bootstrap';

class RegisterContainer extends Component {
  render() {
    return (
      <div style={{width: 660, height: 'auto'}}>
        <ResponsiveEmbed a16by9>
          <embed type="image/svg+xml" src="http://s31.postimg.org/cq2pz5z23/hamster.jpg?noredir=1" />
        </ResponsiveEmbed>
      </div>
    );
  }
}

export default RegisterContainer;
