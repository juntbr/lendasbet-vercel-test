/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  changefreq: 'daily',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/checkout/thank-you',
    '/account/reset-password',
    '/account/impersonated-login',
    '/account/email-confirm',
    '/account/active',
    '/listOfSports',
    '/liveSports',
  ],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}

export default config
