import React, { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'

import { Location, Sport } from 'types/sports'
import { SessionResponse, useSession } from '@/hooks/useSession'
import LocationItem from './LocationItem'
import Icon from './Icon'
import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'

interface SportsSidebarMobileProps {
  data: Sport
  onClick?: (sport: Sport) => void
}

const SportItem: React.FC<SportsSidebarMobileProps> = (props) => {
  const { data, onClick } = props

  const { i18n } = useTranslation()

  const { session } = useSession()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState([])

  const handleOnclick = async () => {
    setIsDropdownOpen(!isDropdownOpen)
    onClick?.(data)

    if (!isDropdownOpen) {
      try {
        setIsLoading(true)

        const response = await session.call<SessionResponse<Location>>(
          '/sports#locations',
          {
            lang: i18n.language ?? 'pt',
            sportId: data.id,
          },
        )

        setLocations(response.records)
      } catch (error) {
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      className={`${
        isDropdownOpen ? 'w-full border-b border-primary' : 'w-full'
      }`}
    >
      <button
        className="item-center group flex w-full cursor-pointer items-center justify-between transition-all duration-300 ease-in-out"
        onClick={handleOnclick}
        title={data.name}
      >
        <div className="flex items-center space-x-3">
          <Icon type="sports" id={data.id} />
          <span
            className={`${
              isDropdownOpen
                ? 'text-primary'
                : 'text-neutral-20 group-hover:text-white'
            } w-28 truncate whitespace-nowrap text-start text-sm font-bold leading-6`}
          >
            {data.name}
          </span>
        </div>

        {isDropdownOpen ? (
          <ChevronUpIcon
            className="-mr-1 ml-1 h-5 w-5 text-neutral-20 group-hover:text-white"
            aria-hidden="true"
          />
        ) : (
          <ChevronDownIcon
            className="-mr-1 ml-1 h-5 w-5 text-neutral-20 group-hover:text-white"
            aria-hidden="true"
          />
        )}
      </button>

      <ul className={`${isDropdownOpen ? 'w-full' : 'hidden'} `}>
        {locations?.length === 0 && isLoading && <LoadingSkeletonSidebar />}
        {!isLoading && locations?.length > 0 && (
          <div className="flex flex-col items-start justify-center space-y-5 p-2 pt-5 ">
            {locations.map((item) => (
              <LocationItem data={item} key={item.id} sportId={data.id} />
            ))}
          </div>
        )}
      </ul>
    </div>
  )
}

export default SportItem
