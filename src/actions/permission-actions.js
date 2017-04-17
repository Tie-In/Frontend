export const SET_PERMISSION_ORG = 'SET_PERMISSION_ORG';
export const SET_PERMISSION_PROJECT = 'SET_PERMISSION_PROJECT';

export const setOrganization = (value) => {
  return {
    type: SET_PERMISSION_ORG,
    value,
  };
};

export const setProject = (value) => {
  return {
    type: SET_PERMISSION_PROJECT,
    value,
  };
};