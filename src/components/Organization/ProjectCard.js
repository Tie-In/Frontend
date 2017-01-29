import React, { PropTypes, Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';

class ProjectCard extends Component {
  render() {
    const { projects } = this.props;
    return (
      <div style={articleStyles}>
        <Button>Create new project</Button>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
