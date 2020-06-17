import axios from 'axios'
import qs from 'qs'
import store from '../store'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = '/v1/api'

const loadSttDefaultToken = () => {
  const user = store.getters['STT/USER/User']
  axios.defaults.headers.common['Authorization'] = user ?  `Bearer ${user.token}` : ''
} 

const exec = (params) => {
  
  loadSttDefaultToken()
  store.commit('UPDATE_ATTRIBUTE_HTTP2', { sending: true, ok: false, error: false })

  return new Promise((resolve, reject) => {
    
    if (params.data) {
      params.transformRequest = [function (data) {
        return qs.stringify(data)
      }]
    }

    if (params.headers) {
      params.transformRequest = [function (data, headers) {
        headers.common['Authorization'] = params.headers['Authorization']
        return headers //{qs.stringify(data)
      }]
    }

    axios(params).then((res) => {
      store.commit('UPDATE_ATTRIBUTE_HTTP2', { ok: true, sending: false })
      setTimeout(() => {
        store.commit('UPDATE_ATTRIBUTE_HTTP2', { ok: false })
      }, 5000 )
      resolve(res.data)

    }).catch((err) => {
      store.commit('UPDATE_ATTRIBUTE_HTTP2', { error: true, sending: false })
      setTimeout(() => {
        store.commit('UPDATE_ATTRIBUTE_HTTP2', { error: false })
      }, 5000 )
      reject(err.response.data)
    })

  })
}
export default {
  exec
}