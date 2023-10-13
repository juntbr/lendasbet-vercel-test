import React, { useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { Location } from 'types/sports'
import { SessionResponse, useSession } from '@/hooks/useSession'
import { AppContext } from 'contexts/context'
import Icon from './Icon'
import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'
import useSidebar from '@/hooks/useSidebar'

interface SportsSidebarMobileProps {
  data: Location
  sportId: number
  onClick?: () => void
}

export const LocationItem: React.FC<SportsSidebarMobileProps> = (props) => {
  const { onClick, sportId, data } = props

  const { i18n } = useTranslation()

  const { session } = useSession()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState([])

  const { createUrl } = useContext(AppContext)

  const { closeMenu } = useSidebar()

  const handleOnclick = async () => {
    setIsDropdownOpen(!isDropdownOpen)
    onClick?.()

    if (!isDropdownOpen) {
      try {
        setIsLoading(true)

        const response = await session.call<SessionResponse<Location>>(
          `/sports#tournaments`,
          {
            lang: i18n.language ?? 'pt',
            sportId,
            locationId: data.id,
          },
        )

        setLocations(response.records)
      } catch (error) {
        setIsDropdownOpen(false)
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <button
        className="item-center group flex w-full cursor-pointer justify-between transition-all duration-300 ease-in-out"
        onClick={handleOnclick}
        title={data.name}
      >
        <div className="flex items-center space-x-3">
          <Icon type="locations" id={data.id} />
          <span
            className={`${
              isDropdownOpen && 'text-primary'
            } flex w-28 justify-start truncate  whitespace-nowrap text-sm font-bold text-neutral-20 group-hover:text-white`}
          >
            {data.name}
          </span>
        </div>

        <span className="whitespace-nowrap text-sm font-bold text-neutral-20 group-hover:text-white">
          {isDropdownOpen ? (
            <ChevronUpIcon
              className="hover:text-white-100 -mr-1 ml-1 h-5 w-5 text-primary"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="-mr-1 ml-1 h-5 w-5 text-neutral-20 group-hover:text-white"
              aria-hidden="true"
            />
          )}
        </span>
      </button>

      <ul className={`${isDropdownOpen ? 'w-full ' : 'hidden'} `}>
        {locations?.length === 0 && isLoading && <LoadingSkeletonSidebar />}
        {!isLoading && locations?.length > 0 && (
          <div className="flex flex-col items-start justify-center space-y-4 px-2">
            {locations.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    createUrl(item)
                    closeMenu()
                  }}
                  className="group flex w-full cursor-pointer items-center justify-between space-x-3 transition-all duration-300 ease-in-out"
                  title={item.name}
                >
                  <span className="truncate whitespace-nowrap text-sm font-bold text-neutral-20 group-hover:text-white">
                    {item.name}
                  </span>

                  <span className="truncate whitespace-nowrap text-sm font-bold text-neutral-20 group-hover:text-white">
                    {item.numberOfEvents}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </ul>
    </>
  )
}

export default LocationItem
