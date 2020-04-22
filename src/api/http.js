import axios from 'axios'
import qs from 'qs'
import { BACKEND_URL } from '../config/constants'

const instance = axios.create({
  baseURL: BACKEND_URL
})

export const getRequest = (url, params) => {
  return instance({
    method: 'get',
    url,
    params,
    paramsSerializer: qs.stringify,
  })
}

export const postRequest = (url, data) => {
  return instance({
    method: 'post',
    url,
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [qs.stringify]
  })
}

export const uploadRequest = (url, data) => {
  return instance({
    method: 'post',
    url,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const downRequest = (url, params) => {
  return instance({
    method: 'get',
    url,
    params,
    paramsSerializer: qs.stringify
  })
}