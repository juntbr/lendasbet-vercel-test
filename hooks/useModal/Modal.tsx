import React, { cloneElement, useEffect, useState } from 'react'
import ModalContainer from './ModalContainer'
import { useModal } from './index'

export function Modal() {
  const { close, isVisible, children, hasCloseIcon, image, width } = useModal()
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    let modalCloseTimeout: NodeJS.Timeout

    if (isVisible) {
      setShouldRender(true)
    } else {
      modalCloseTimeout = setTimeout(() => setShouldRender(false), 300)
    }

    return () => {
      clearTimeout(modalCloseTimeout)
    }
  }, [isVisible])

  if (!shouldRender || typeof window === 'undefined' || !children) {
    return null
  }

  return (
    <ModalContainer
      image={image}
      width={width}
      closeModal={close}
      onClick={(event) => event.stopPropagation()}
      hasCloseIcon={hasCloseIcon}
    >
      {cloneElement(children as React.ReactElement, { close })}
    </ModalContainer>
  )
}
