import axios from 'axios'

export const api = axios.create({
  timeout: 3000,
  baseURL: import.meta.NODE_ENV != 'product'?'http://8.214.23.100:8800/api/gem/':'//1boxnft.com/api/gem/'
})

export const checkAddress = (address)=> {
  return api.get('checkAddress',{params:{
    address
  }})
}