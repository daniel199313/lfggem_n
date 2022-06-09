import axios from 'axios'
import getConfig from '../config'
const cfg = getConfig()

export const api = axios.create({
  timeout: 3000,
  baseURL: cfg.baseUrl
})

export const checkAddress = (address)=> {
  console.log(import.meta)
  return api.get('checkAddress',{params:{
    address
  }})
}