import clsxm from '@/utils/clsxm'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Fragment, ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import useWindowSize from '../UseWindowSize'
import { Button } from 'design-system/button'

type ChildrenType = ReactNode | null

interface ModalContainerProps {
  children: ReactNode
  hasCloseIcon: boolean
  image: ChildrenType
  width: string
  closeModal: (open: boolean) => void
  [key: string]: any
}

export default function ModalContainer({
  children,
  hasCloseIcon,
  closeModal,
  image,
  width,
  ...props
}: ModalContainerProps) {
  const cancelButtonRef = useRef(null)
  const { isMobile } = useWindowSize()

  function closeModalOnBackground() {
    return hasCloseIcon ? closeModal(false) : () => {}
  }

  return (
    <Transition.Root key={width} appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeModalOnBackground}
        {...props}
      >
        <div className="flex items-center justify-center min-h-screen text-center sm:block sm:items-start">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-opacity-50 fliter bg-background backdrop-blur-sm" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsxm(
                'relative z-50 my-10 inline-block h-screen w-full max-w-lg overflow-x-hidden border border-borderColor bg-background text-left align-middle shadow-xl shadow-primary/20 transition-all sm:h-full sm:rounded-lb',
                width,
              )}
            >
              {hasCloseIcon && (
                <Button
                  size="small"
                  variant="secondary"
                  className="absolute right-1 top-1 z-50 h-7 w-7 !rounded-full p-1"
                >
                  <XMarkIcon
                    onClick={() => closeModal(false)}
                    className="z-50 text-white h-7 w-7 hover:text-primary"
                  />
                </Button>
              )}

              <div
                className={`relative w-full ${
                  image && !isMobile && 'grid grid-cols-2'
                }`}
              >
                {image && image}
                <div className="relative flex flex-col items-center justify-center w-full p-6 text-start">
                  {children}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
