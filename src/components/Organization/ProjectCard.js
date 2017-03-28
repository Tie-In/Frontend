import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../style/projectCardStyle.css';
import '../../style/autosuggestStyle.css';
import userimg from '../../images/user1.png';

class ProjectCard extends Component {
  render() {
    const cardStyle = {
      height: '150px',
      width: '100%',
      border: 'solid 1px #E5E5E5',
      borderRadius: '4px',
      marginBottom: '30px',
      padding: '0 5% 0 5%',
    };
    const { project } = this.props;
    const descriptionStyle = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
    const imgStyle = {
      display: 'flex',
      alignItems: 'center',
      backgroundRepeat: 'no-repeat',
    };
    return (
      <div className="card" style={cardStyle}>
        <LinkContainer to={{ pathname: `/organizations/${project.organization_id}/projects/${project.id}` }}>
          <a key={project.name}><h3>{project.name}</h3></a>
        </LinkContainer>
        <p style={descriptionStyle}>{project.description}</p>
        <div>
          <img src={userimg} style={imgStyle} alt="contributor-thumbnail" />
        </div>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
