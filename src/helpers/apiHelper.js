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

export function get(path, parameter) {
  return axios({
    method: 'GET',
    url: path,
    params: parameter,
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
  });
}

export function put(path, body) {
  return axios({
    method: 'PUT',
    url: path,
    data: body,
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
  });
}

export function del(path) {
  return axios({
    method: 'DELETE',
    url: path,
    headers: {
      Authorization: `${localStorage.getItem('token') || ''}`,
    },
  });
}
