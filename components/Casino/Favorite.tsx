import React, { useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'

interface FavoriteProps {
  checked: boolean
  onClick: (currentChecked?: boolean) => void
}

export const Favorite: React.FC<FavoriteProps> = ({ checked, onClick }) => {
  const [isHover, setIsHover] = useState(false)

  const handleClick = () => {
    onClick?.(checked)
  }

  return (
    <button
      className="cursor-pointer"
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onClick={handleClick}
    >
      {isHover || checked ? (
        <StarIcon className="w-5 h-5 mb-1 text-favorite lg:h-6 lg:w-6" />
      ) : (
        <StarIconOutline className="w-5 h-5 mb-1 text-white lg:h-6 lg:w-6" />
      )}
    </button>
  )
}
