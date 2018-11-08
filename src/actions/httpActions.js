import axios from 'axios';
import { API } from '../utils/constants';
import { tokenCopyPaste } from '../utils/functions';

export function getRequest(data, controller) {
  return dispatch => {
    return axios.get(`${API}${controller}`, {params: data, headers: { Authorization: tokenCopyPaste() }});
  }
}

export function getlistRequest(data, id, controller) {
  return dispatch => {
    return axios.get(`${API}${controller}/${id}`, {params: data, headers: { Authorization: tokenCopyPaste() }});
  }
}

export function postRequest(data, controller) {
  return dispatch => {
    return axios.post(`${API}${controller}`, data, { headers: { Authorization: tokenCopyPaste() }});
  }
}

export function putRequest(data,id,controller) {
  return dispatch => {
    return axios.put(`${API}${controller}/${id}`, data, { headers: { Authorization: tokenCopyPaste() }});
  }
}

export function deleteRequest(data,id,controller) {
  return dispatch => {
    return axios.delete(`${API}${controller}/${id}`, {params: data, headers: { Authorization: tokenCopyPaste() }});
  }
}