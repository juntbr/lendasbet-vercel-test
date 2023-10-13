import { useEffect } from 'react'

export default function GetAffiliateCookie() {
  useEffect(() => {
    window.addEventListener('message', function (event) {
      const cookieValue = document.cookie.replace(
        /(?:(?:^|.*;\s*)btag\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      )
      event.source.postMessage(cookieValue)
    })
  }, [])
  return null
}

export async function getServerSideProps() {
  return {
    props: {
      noApp: true,
    },
  }
}

GetAffiliateCookie.getLayout = function getLayout(page) {
  return <>{page}</>
}
