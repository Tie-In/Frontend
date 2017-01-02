import React, { PropTypes } from 'react';
import Person from './Person';

class PeopleList extends React.Component {

  render() {
    const { people } = this.props;
    return (
      <div>
        {
          people.map((person) =>
            <Person key={person.lastname} person={person} />,
          )
        }
      </div>
    );
  }
}

PeopleList.propTypes = {
  people: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PeopleList;
