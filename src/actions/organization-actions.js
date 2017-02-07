import * as types from './action-types';

export const setOrganization = (organization) => {
  return {
    type: types.SET_ORGANIZATION,
    organization,
  };
};
