import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../style/projectStyle.css';

class ProjectCard extends Component {
  render() {
    const cardStyle = {
      height: '150px',
      width: '100%',
      border: 'solid 1px #E5E5E5',
      borderRadius: '4px',
      marginBottom: '30px',
      // position: 'absolute',
    };
    const { project } = this.props;
    const descriptionStyle = {
      width: '90%',
      position: 'absolute',
    };
    console.log(project);
    return (
      <div style={cardStyle}>
        <div className="container">
          <LinkContainer to={{ pathname: `/organizations/${project.organization_id}/projects/${project.id}` }}>
            <a key={project.name}><h3>{project.name}</h3></a>
          </LinkContainer>
          <p style={descriptionStyle}>{project.description}</p>
        </div>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
