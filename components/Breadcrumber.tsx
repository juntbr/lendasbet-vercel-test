import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export function Breadcrumber({ pages }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 sm:space-x-4">
        <li>
          <Link
            href="/cassino"
            passHref
            className="text-textPrimary hover:text-primary"
          >
            <HomeIcon
              className="mb-0.5 h-4 w-4 flex-shrink-0 lg:h-5 lg:w-5"
              aria-hidden="true"
            />
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon className="flex-shrink-0 w-4 h-4 text-primary lg:h-5 lg:w-5" />
              <Link
                href={page.href}
                passHref
                className={`${
                  page.current
                    ? 'w-44 cursor-default overflow-hidden truncate text-primary'
                    : 'text-textPrimary hover:text-primary hover:underline'
                } ml-2 text-xs lg:text-sm`}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
