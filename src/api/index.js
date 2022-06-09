import axios from 'axios'

export const api = axios.create({
  timeout: 3000,
  baseURL: import.meta.NODE_ENV != 'product'?'/api/gem/':'//1boxnft.com/api/gem/'
})

export const checkAddress = (address)=> {
  return api.get('checkAddress',{params:{
    address
  }})
}