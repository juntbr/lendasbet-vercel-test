/* eslint-disable @typescript-eslint/no-var-requires */
import { withSentryConfig } from '@sentry/nextjs'

import BundleAnalyzer from '@next/bundle-analyzer'

import i18nextConfig from './next-i18next.config.cjs'

import nextBuildId from 'next-build-id'

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const NextConfig = {
  i18n: i18nextConfig.i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lendasbet.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'conteudo.lendasbet.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.everymatrix.com',
        pathname: '/**',
      },
    ],
  },
  // reactStrictMode: true,
  // swcMinify: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    // In order to be able to deminify errors, @sentry/nextjs creates sourcemaps and uploads them to the Sentry server. Depending on your deployment setup, this means your original code may be visible in browser devtools in production. To prevent this, set hideSourceMaps to true in the sentry options in your next.config.js. To disable this warning without changing sourcemap behavior, set hideSourceMaps to false. (In @sentry/nextjs version 8.0.0 and beyond, this option will default to true.) See https://webpack.js.org/configuration/devtool/ and https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map for more information.
    hideSourceMaps: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  generateBuildId: () => nextBuildId({ dir: __dirname })
}

const moduleExports = withBundleAnalyzer(NextConfig)

const sentryWebpackPluginOptions = {
  org: 'lendasbet',
  project: 'lendasbet',
  silent: true,
}
const extraSentryConfigs = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
}

export default withSentryConfig(
  moduleExports,
  sentryWebpackPluginOptions,
  extraSentryConfigs,
)
