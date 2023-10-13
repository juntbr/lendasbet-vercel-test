import Script from 'next/script'
import React from 'react'

declare global {
  interface Window {
    grecaptcha: {
      execute: () => Promise<string>
      getResponse: () => void
      ready: () => void
      render: (F: () => void) => void
      reset: () => void
    }
    onloadCallback: Function
  }
}

export function Recaptcha() {
  // const text
  return (
    <>
      <div
        id="captcha_place_holder"
        className="g-recaptcha hidden"
        data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        data-size="invisible"
      ></div>
      <Script
        id="recaptcha"
        src={`https://www.google.com/recaptcha/api.js`}
        async
        defer
      />
    </>
  )
}

export default Recaptcha
