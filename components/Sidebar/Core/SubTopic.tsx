import { SubItem } from './types'
import dynamic from 'next/dynamic'
import { Button } from 'design-system/button'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AppContext } from 'contexts/context'

const configSuspense = {
  suspense: true,
}

const Populars = dynamic(() => import('./Casino/Populars'), {
  ...configSuspense,
})

const KindOfGames = dynamic(() => import('./Casino/KindOfGames'), {
  ...configSuspense,
})

const RecentlyGames = dynamic(() => import('./Casino/RecentlyGames'), {
  ...configSuspense,
})

const AllSports = dynamic(() => import('./Sports/AllSports'), {
  ...configSuspense,
})

const PopularMatches = dynamic(() => import('./Sports/PopularMatches'), {
  ...configSuspense,
})

const Title = ({ item }: { item: SubItem }) => (
  <span className="text-xs font-semibold leading-6 uppercase text-start text-primary lg:text-sm">
    {item.name}
  </span>
)

export default function SubTopic({ item }: { item: SubItem }) {
  const { push } = useRouter()
  const { setOpenSideBar, openSideBar } = useContext(AppContext)

  if (item.hide) return null

  if (item.populars) {
    return (
      <div className="flex flex-col items-start justify-start w-full space-y-2">
        <Title item={item} />
        <Populars />
      </div>
    )
  }

  if (item.kindOfGames) {
    return (
      <div className="flex flex-col items-start justify-start w-full space-y-2">
        <Title item={item} />
        <KindOfGames />
      </div>
    )
  }

  if (item.recentlyGames) {
    return (
      <div className="relative flex flex-col items-start justify-start w-full space-y-2 overflow-hidden h-52">
        <Title item={item} />
        <RecentlyGames />
        <Button
          onClick={() => {
            setOpenSideBar(!openSideBar)
            push('/cassino/jogados-recentemente')
          }}
          className="absolute bottom-0 w-full"
          variant="primary"
          size="small"
          style={{ filter: 'drop-shadow(1px -5px 50px #1FBC53)' }}
        >
          Ver mais
        </Button>
      </div>
    )
  }

  if (item.allSports) {
    return (
      <div className="flex flex-col items-start justify-start w-full space-y-2">
        <Title item={item} />
        <AllSports />
      </div>
    )
  }

  if (item.popularMatches) {
    return (
      <div className="flex flex-col items-start justify-start w-full space-y-2">
        <Title item={item} />
        <PopularMatches />
      </div>
    )
  }
}
