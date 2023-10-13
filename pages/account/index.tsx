import { useContext, useEffect } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAuth } from 'hooks/useAuth'
import { AppContext } from 'contexts/context'
import useWindowSize from '@/hooks/UseWindowSize'

export default function Profile() {
  const { push } = useRouter()
  const { isLogged } = useAuth()
  const { isMobile } = useWindowSize()

  const { accountPanels }: { accountPanels } = useContext(AppContext)

  useEffect(() => {
    if (isMobile) {
      push('/cassino')
    }

    const timer = setTimeout(() => {
      if (!isLogged) {
        push('/cassino')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLogged, isMobile])

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-[80rem] flex-col">
      <dl className="mt-6 space-y-6">
        {accountPanels.map((panel) => {
          const id = (Math.random() + 1).toString(36).substring(7)

          return (
            <Disclosure
              as="div"
              key={id}
              className="rounded-lb bg-secondary"
              defaultOpen={panel.defaultOpen}
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex h-[52px] w-full items-center justify-between rounded-t-md px-4">
                    <span className="text-xl font-bold text-white">
                      {panel.title}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDownIcon
                        className={`${
                          open
                            ? '-rotate-180 text-primary'
                            : 'rotate-0 text-textPrimary'
                        } h-6 w-6 transform`}
                      />
                    </span>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel
                      as="dd"
                      className="border-t border-borderColor p-4 pr-12"
                    >
                      {panel.component}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          )
        })}
      </dl>
      <div className="py-36"></div>
    </div>
  )
}
