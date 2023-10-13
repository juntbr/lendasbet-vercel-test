import { createContext, useContext, useEffect, useState } from 'react'

const WindowSizeContext = createContext({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
})

export function WindowSizeProvider({ children }) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)

    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  )
}

export default function useWindowSize() {
  const windowSize = useContext(WindowSizeContext)
  const isMobile = windowSize.width < 1024

  return { width: windowSize.width, height: windowSize.height, isMobile }
}
