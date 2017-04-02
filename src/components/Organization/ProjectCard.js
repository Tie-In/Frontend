import React, { PropTypes, Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import ReactTooltip from 'react-tooltip';
import '../../style/projectCardStyle.css';
import '../../style/autosuggestStyle.css';
// import userimg from '../../images/user1.png';

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
    return (
      <div className="card" style={cardStyle}>
        <LinkContainer to={{ pathname: `/organizations/${project.organization_id}/projects/${project.id}` }}>
          <a key={project.name}><h3>{project.name}</h3></a>
        </LinkContainer>
        <p style={descriptionStyle}>{project.description}<br /></p>
        <div style={thumbnaildiv}>
          {
            project.users.map((user) => {
              return <img src={`../../src/images/${user.image}.png`} style={imgStyle} alt="contributor-thumbnail" data-tip={`${user.firstname} ${user.lastname}`} />;
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
