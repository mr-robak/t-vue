/* eslint-env node */
/* global process, module */
/** @type {import('@vue/cli-service').ProjectOptions} */
const config = {
  publicPath: process.env.NODE_ENV === 'production' ? '/t-vue/' : '/',
}

module.exports = config
