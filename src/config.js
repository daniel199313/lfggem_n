const dev = {
  baseUrl: 'https://tapi.99box.co/api/gem/',
  contractAddress: '0xe8c2d81c82bb768ca2dc4ada1c6407732b809966',
  chainId: '0x4',
}

const prod = {
  baseUrl: '//api.lfggemnft.wtf/api/gem/',
  contractAddress: '0x7350b11e511695F51D8182aA899F6E6AA59061fC',
  chainId: '0x1'
}

export default ()=> {
  console.log('mode',import.meta.env.MODE, import.meta.env)
  return import.meta.env.MODE == 'development'? dev: prod
}