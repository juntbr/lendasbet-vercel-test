/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const languagesObj = require('./constants/languages.cjs')
const HttpBackend = require('i18next-http-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'
const isDev = process.env.DEBUG_I18N
  ? JSON.parse(process.env.DEBUG_I18N)
  : false
if (isDev) console.log('Debug i18n activated')

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: isDev,
  backend: {
    backendOptions: [{ expirationTime: isDev ? 0 : 60 * 60 * 1000 }, {}], // 1 hour
    backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
    localePath: path.resolve('./public/locales'),
  },
  i18n: {
    defaultLocale: languagesObj.defaultLocale,
    locales: Object.keys(languagesObj.languages),
  },
  localePath: path.resolve('./public/locales'),
  bindI18n: 'languageChanged loaded',
  serializeConfig: false,
  use: isBrowser ? [ChainedBackend] : [],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
