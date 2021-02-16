#!/usr/bin/env node
// vim: set ft=javascript:

const { initSpace } = require('../../lib/store')
const proxyToHttpsAgent = require('../util/proxy')

exports.command = 'init'

exports.desc =
  'Prepares the specified space to allow managed migration scripts.\nThe "Migration" content-type will be created in your contentful space'

exports.builder = (yargs) => {
  yargs
    .option('access-token', {
      alias: 't',
      describe:
        'Contentful Management API access token',
      demandOption: true,
      default: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
      defaultDescription: 'environment var CONTENTFUL_MANAGEMENT_ACCESS_TOKEN'
    })
    .option('space-id', {
      alias: 's',
      describe: 'space id to use',
      type: 'string',
      requiresArg: true,
      demandOption: true,
      default: process.env.CONTENTFUL_SPACE_ID,
      defaultDescription: 'environment var CONTENTFUL_SPACE_ID'
    })
    .option('environment-id', {
      alias: 'e',
      describe: 'id of the environment within the space',
      type: 'string',
      requiresArg: true,
      default: process.env.CONTENTFUL_ENV_ID || 'master',
      defaultDescription: 'environment var CONTENTFUL_ENV_ID if exists, otherwise master'
    })
    .option('proxy', {
      alias: 'p',
      describe: 'proxy configuration in HTTP auth format: host:port or user:password@host:port',
      type: 'string',
      default: process.env.HTTPS_PROXY || process.env.HTTP_PROXY,
      defaultDescription: 'environment var HTTPS_PROXY or HTTP_PROXY'
    })
}

exports.handler = async ({ accessToken, spaceId, environmentId, proxy }) => {
  if (proxy) {
    console.log('Using proxy', proxy)
  }
  var httpsAgent = new proxyToHttpsAgent(proxy)
  return initSpace(accessToken, spaceId, environmentId, httpsAgent)
}
