const dev = {
  baseUrl: '//8.214.23.100:8800/api/gem/',
  contractAddress: '0xe8c2d81c82bb768ca2dc4ada1c6407732b809966',
  chainId: '0x4',
}

const prod = {
  baseUrl: '/api/gem/',
  contractAddress: '0xe8c2d81c82bb768ca2dc4ada1c6407732b809966',
  chainId: '0x1'
}

export default ()=> {
  console.log('mode',import.meta.env.MODE, import.meta.env)
  return import.meta.env.MODE == 'development'? dev: prod
}