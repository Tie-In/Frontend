import React, { PropTypes, Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import ReactTooltip from 'react-tooltip';
import '../../style/projectCardStyle.css';

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
      marginRight: '7px',
    };
    const thumbnaildiv = {
      width: '100%',
      overflowY: 'hidden',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    };

    const tempPath = `/organizations/${project.organization_id}/projects/${project.id}`;
    let newPath = '';
    if (!project.effort_estimation) {
      newPath = `${tempPath}/planning/features`;
    } else if (project.current_sprint_id !== null) {
      newPath = `${tempPath}/board`;
    } else {
      newPath = `${tempPath}/backlog`;
    }
    return (
      <div className="card" style={cardStyle}>
        <LinkContainer to={{ pathname: newPath }}>
          <a key={project.name}><h3>{project.name}</h3></a>
        </LinkContainer>
        <p style={descriptionStyle}>{project.description}</p>
        <br />
        <div style={thumbnaildiv}>
          {
            project.users.map((user) => {
              return <img src={user.image} style={imgStyle} alt="contributor-thumbnail" data-tip={`${user.firstname} ${user.lastname}`} key={user.username} />;
            })
          }
        </div>
        <ReactTooltip effect="solid" place="bottom" />
      </div>
    );
  }
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
