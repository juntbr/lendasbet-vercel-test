import clsxm from '@/utils/clsxm'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { AppContext } from 'contexts/context'
import debouce from 'lodash.debounce'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Input } from './Input'

interface SearchComponentProps extends ComponentProps<'input'> {
  submit?: (input?: string) => void
  input: string
}

export default function Search({
  submit = () => '',
  input = null,
  className,
}: SearchComponentProps) {
  const router = useRouter()
  const { setSidebarSearchQuery, sidebarSearchQuery } = useContext(AppContext)
  const { t } = useTranslation(['common'])

  const [searchState, setSearchState] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(
    (e) => {
      setSidebarSearchQuery(e.target.value)
    },
    [setSidebarSearchQuery],
  )

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 500)
  }, [handleChange])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  const handleSearchClearClick = () => {
    if (sidebarSearchQuery?.length > 0) {
      setSidebarSearchQuery('')
      if (searchInputRef?.current) {
        searchInputRef.current.value = ''
      }
    }
  }

  function search() {
    setSearchState(true)
    submit(searchInputRef.current.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search()
    }
  }

  const isSearching = sidebarSearchQuery?.length > 0

  useEffect(() => {
    if (!isSearching) {
      setSearchState(false)
    }
  }, [sidebarSearchQuery])

  useEffect(() => {
    const exitingFunction = (futureURL) => {
      const STANDARD_CASINO = futureURL.includes('/cassino')
      const LIVE_CASINO = futureURL.includes('/cassino/ao-vivo')
      if ((!STANDARD_CASINO && !LIVE_CASINO) || LIVE_CASINO) {
        handleSearchClearClick()
      }
    }

    router.events.on('routeChangeStart', exitingFunction)

    return () => {
      router.events.off('routeChangeStart', exitingFunction)
    }
  }, [searchState])

  useEffect(() => {
    if (input) {
      searchInputRef.current.value = input
    }
  }, [sidebarSearchQuery])

  return (
    <div className={clsxm('relative', className)}>
      <Input
        ref={searchInputRef}
        onChange={debouncedResults}
        onKeyDown={handleKeyDown}
        type="search"
        isFullWidth
        placeholder={t('Search')}
        className="pl-10"
      />
      <span
        onClick={handleSearchClearClick}
        className="absolute bottom-1.5 left-1 top-1 border-none bg-transparent p-2 text-textPrimary"
      >
        {sidebarSearchQuery?.length > 0 ? (
          <XMarkIcon
            title="Limpar"
            className="mt-0.5 h-auto w-5 cursor-pointer"
          />
        ) : (
          <MagnifyingGlassIcon title="Buscar" className="mt-0.5 h-auto w-5" />
        )}
      </span>

      {sidebarSearchQuery?.length > 0 && (
        <span
          onClick={search}
          title="Buscar"
          className="absolute bottom-2 right-1 top-1.5 border-transparent bg-transparent p-2 text-white hover:text-primary"
        >
          <MagnifyingGlassIcon className="mt-0.5 h-auto w-5" />
        </span>
      )}
    </div>
  )
}
