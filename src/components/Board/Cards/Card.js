import React, { PropTypes, Component } from 'react';
import { Label, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EditModal from './EditModal';
import * as apiHelper from '../../../helpers/apiHelper';
import * as listsActions from '../../../actions/list-actions';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      openModal: false,
      allUsers: [],
      allTags: [],
      allFeatures: [],
    };

    this.setModal = this.setModal.bind(this);
  }

  async setModal(isOpen, task) {
    if (isOpen === true) {
      const { item, project } = this.props;
      this.setState({ openModal: true });
      try {
        const responseUser = await apiHelper.get('/api/users', {
          project: item.project_id,
        }, true);
        const users = responseUser.data;
        const responseTag = await apiHelper.get('/api/tags', {
          project: item.project_id,
        });
        this.setState({
          allUsers: users,
          allTags: responseTag.data,
          allFeatures: project.features,
        });
      } catch (err) {
        console.log(err);
      }
    } else if (task !== undefined) {
      try {
        const response = await apiHelper.put(`/api/tasks/${this.props.item.id}`, task);
        const tempTask = response.data.task;
        const statuses = response.data.statuses;
        this.props.setShow(false, tempTask);
        this.props.listsActions.setList(statuses);
        this.setState({
          item: tempTask,
          openModal: isOpen,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({ openModal: isOpen });
    }
  }

  render() {
    const { style } = this.props;
    const { item } = this.state;

    return (
      <div
        style={style} className="item"
        id={style ? item.id : null} onClick={() => { this.setModal(true); }}
      >
        <div className="item-name">
          {item.name} <Badge pullRight>{item.story_point}</Badge>
        </div>
        <div className="item-container">
          <div className="item-content">
            <p>{item.description}</p>
          </div>
          <div className="item-footer">
            {item.tags.map((tag) => {
              const labelStyle = {
                backgroundColor: tag.color,
                marginRight: '10px',
              };
              return <Label key={tag.id} style={labelStyle}>{tag.name}</Label>;
            })}
            <span style={{ display: 'inline-block' }} />
            { item.user ?
              <img
                style={{ width: 20, height: 20, borderRadius: '50%' }}
                className="pull-right"
                src={item.user.image}
                alt="Perfomer"
              /> : <div />
            }
          </div>
        </div>
        { this.state.openModal ?
          <EditModal
            show={this.state.openModal} item={item} setShow={this.setModal}
            tagSelection={this.state.allTags} featureSelection={this.state.allFeatures}
            userSelection={this.state.allUsers}
          /> :
          <div />
        }
      </div>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
  project: PropTypes.object.isRequired,
  listsActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listsActions: bindActionCreators(listsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
