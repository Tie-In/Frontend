import axios from 'axios';

export function post(path, body) {
  return axios({
    method: 'POST',
    url: path,
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
    data: body,
  });
}

export function get(path) {
  return axios({
    method: 'GET',
    url: path,
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
  });
}

// export default { apiPost, apiGet };
