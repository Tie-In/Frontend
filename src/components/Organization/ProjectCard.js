import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ProjectCard extends Component {
  render() {
    const cardStyle = {
      height: '150px',
      width: '100%',
      border: 'solid 1px #E5E5E5',
      borderRadius: '4px',
      marginBottom: '50px',
    };
    const { project } = this.props;
    return (
      <div style={cardStyle}>
        <div className="container">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <LinkContainer to={{ pathname: `/organizations/${project.organization_id}/projects/${project.id}` }}>
            <Button>To project</Button>
          </LinkContainer>
        </div>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
