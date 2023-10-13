import { fontFamily } from 'tailwindcss/defaultTheme'
import tailwindScrollbar from 'tailwind-scrollbar'
import tailwindForms from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import tailwindAspectRatio from '@tailwindcss/aspect-ratio'
import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './design-system/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{ts,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          DEFAULT: '#8F8F8F',
          10: '#F7F7F7',
          20: '#E0E0E0',
          30: '#C5C5C5',
          40: '#AAAAAA',
          50: '#8F8F8F',
          60: '#747474',
          70: '#595959',
          80: '#262626',
          90: '#121212',
          100: '#080808',
        },
        primary: '#25F56A',
        primaryHover: '#1FBC53',
        favorite: '#FFD707',
        secondary: '#0B141A',
        background: '#111B21',
        textPrimary: '#6796A0',
        disableColor: '#868686',
        borderColor: '#1E2B33',
      },
      fontFamily: {
        sans: ['var(--font-kastelov)', ...fontFamily.sans],
      },
      borderRadius: {
        lb: '4px',
      },
      brightness: {
        25: '.25',
      },
      fontSize: {
        h1: ['3.5rem', '3.5rem'],
        h2: ['3rem', '3rem'],
        h3: ['2.5rem', '2.5rem'],
        h4: ['2rem', '2rem'],
        h5: ['1.5rem', '1.562rem'],
        h6: ['1.25rem', '1.375rem'],
        subtitle: ['1.125rem', '1.312rem'],
        small: ['0.875rem', '1.062rem'],
        medium: ['1rem', '1.187rem'],
        large: ['1.125rem', '1.25rem'],
        btnSmall: ['0.875rem', '0.875rem'],
        btnMedium: ['1rem', '1rem'],
        btnLarge: ['1.125rem', '1.125rem'],
        caption: ['0.625rem', '0.75rem'],
      },
      screens: {
        xs: '370px',
        '8xl': '100rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #108336, #1EC355)',
        'gradient-shadow':
          'linear-gradient(0deg, rgba(0, 0, 0, 0.85) 40.54%, rgba(0, 0, 0, 0) 100%)',
      },
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
    tailwindForms,
    tailwindTypography,
    tailwindAspectRatio,
    flowbitePlugin,
  ],
}

export default config
