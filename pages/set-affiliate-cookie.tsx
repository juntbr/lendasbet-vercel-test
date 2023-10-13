import { useBtag } from '@/hooks/useBtag'

export default function SetAffiliateCookie() {
  useBtag()
  return null
}

export async function getServerSideProps() {
  return {
    props: {
      noApp: true,
    },
  }
}

SetAffiliateCookie.getLayout = function getLayout(page) {
  return <>{page}</>
}
