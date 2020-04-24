import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { BACKEND_URL } from '../config/constants'

const instance = axios.create({
  baseURL: BACKEND_URL
})

instance.interceptors.response.use(
  response => {
    if (response.data instanceof Blob) {
      return response.data
    }

    const { code, data, msg } = response.data

    if (code !== 200) {
      Message.error(msg)
      return Promise.reject(new Error(msg))
    }
    
    return data
  },
  err => Message.error(err.message)
)

export const getRequest = (url, params) => {
  return instance({
    method: 'get',
    url,
    params,
    paramsSerializer: qs.stringify
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
