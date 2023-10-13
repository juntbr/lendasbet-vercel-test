import localFont from 'next/font/local'

export const kastelov = localFont({
  variable: '--font-kastelov',
  src: [
    {
      path: '../public/fonts/Kastelov-Axiforma-Thin.otf',
      weight: '100',
      style: 'thin',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-Light.otf',
      weight: '300',
      style: 'light',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-Medium.otf',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-SemiBold.otf',
      weight: '600',
      style: 'semibold',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-Bold.otf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-ExtraBold.otf',
      weight: '800',
      style: 'extrabold',
    },
    {
      path: '../public/fonts/Kastelov-Axiforma-Black.otf',
      weight: '900',
      style: 'black',
    },
  ],
})
