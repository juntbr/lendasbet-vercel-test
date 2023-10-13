import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Redirect() {
  const { url } = useRouter().query
  useEffect(() => {
    document.body.style.background = '#ffffff'
    window.location.href = url as string
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

Redirect.getLayout = function getLayout(page) {
  return <>{page}</>
}
