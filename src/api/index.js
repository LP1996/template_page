import { getRequest, postRequest, uploadRequest, downRequest } from './http'

const username = localStorage.getItem('name')

/* type requests */
const TYPE_URLS = {
  list: '/type/list',
  add: '/type/add',
  update: '/type/update',
  delete: '/type/delete'
}

export const getAllTypes = () => {
  return getRequest(TYPE_URLS.list, {})
}

export const addType = (name, description) => {
  return postRequest(TYPE_URLS.add, { name, description, username })
}

export const updateType = (name, newName) => {
  return postRequest(TYPE_URLS.update, { name, newName, username })
}

export const deleteType = name => {
  return postRequest(TYPE_URLS.delete, { name })
}

/* resource requests */
const RESOURCE_URLS = {
  list: '/resource/list',
  versions: '/resource/versions',
  down: '/resource/down',
  changelog: '/resource/changelog',
  add: '/resource/add',
  delete: '/resource/delete',
  update: '/resource/update'
}

export const getAllResources = type => {
  return getRequest(RESOURCE_URLS.list, { type })
}

export const getResourceVersion = (type, name) => {
  return getRequest(RESOURCE_URLS.versions, { type, name })
}

export const downResource = (type, name, version) => {
  // version 可选
  return downRequest(RESOURCE_URLS.down, { type, name, version })
}

export const getResourceChangelog = (type, name) => {
  return getRequest(RESOURCE_URLS.changelog, { type, name })
}

// 新增，更新版本都调用此接口
export const addResource = formData => {
  formData.append('username', username)
  return uploadRequest(RESOURCE_URLS.add, formData)
}

export const deleteResource = (type, name) => {
  return postRequest(RESOURCE_URLS.delete, { type, name })
}

// 更新名字用
export const updateResource = (type, name, newName) => {
  return postRequest(RESOURCE_URLS.update, { type, name, newName, username })
}
