const { parse } = require('url')
const { toInteger } = require('lodash')
const HttpsProxyAgent = require('https-proxy-agent')

const parseAuth = (authString) => {
  // authString may be a falsy value like `null`
  const [username, password] = (authString || '').split(':')
  return { username, password }
}
  
const proxyStringToObject = (proxyString) => {
  if (!proxyString.startsWith('http')) {
    return proxyStringToObject(`http://${proxyString}`)
  }

  const {
    hostname: host,
    port: portString,
    auth: authString,
    protocol
  } = parse(proxyString)

  const auth = parseAuth(authString)
  const port = toInteger(portString)
  const isHttps = protocol === 'https:'

  if (!auth.username) {
    return { host, port, isHttps }
  }

  return {
    host,
    port,
    auth,
    isHttps
  }
}

const proxyToHttpsAgent = (proxy) => {
    if ((proxy || '') == '') {
        return null
    }

    const { host, port } = proxyStringToObject(proxy)
    return new HttpsProxyAgent({ host, port })
}

module.exports = proxyToHttpsAgent
