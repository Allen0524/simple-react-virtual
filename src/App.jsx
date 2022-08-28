import {useState, useRef, useEffect} from 'react'
import './App.css'

function App() {
  const parentRef = useRef()

  const {totalSize, virtualItems} = useVirtual({
    count: 100,
    parentRef,
    estimateSize: 30,
    overscan: 10,
    windowHeight: 500,
  })

  return (
    <>
      <div
        ref={parentRef}
        style={{
          width: '400px',
          height: '500px',
          backgroundColor: 'lightgray',
          margin: '100px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${totalSize}px`,
          }}
        >
          {virtualItems.map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '30px',
                transform: `translateY(${i * 30}px)`,
                border: '1px solid black',
                padding: '5px 5px',
                boxSizing: 'border-box',
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* 
TODO: 
1. not support dynamic item height
2. where can I get windowHeight and estimatizeSize
3.
*/

function getRangedList(startIndex, endIndex) {
  let newList = []
  for (let i = startIndex; i <= endIndex; i++) {
    newList.push(i)
  }

  return newList
}

function useVirtual({
  count,
  parentRef,
  estimateSize,
  overscan = 10,
  windowHeight,
}) {
  const [virtualItems, setVirtualItems] = useState(() => {
    return getRangedList(
      0,
      Math.min(Math.floor((0 + windowHeight) / estimateSize) + overscan, count),
    )
  })
  const onScroll = event => {
    const instance = event.currentTarget
    if (instance) {
      const scrollTop = instance.scrollTop
      const startIndex = Math.floor(scrollTop / estimateSize)
      const endIndex = Math.floor((scrollTop + windowHeight) / estimateSize)
      const overscanStartIndex = Math.min(
        startIndex - overscan < 0 ? 0 : startIndex - overscan,
        startIndex,
      )
      const overscanEndIndex = Math.min(endIndex + overscan, count)

      setVirtualItems(getRangedList(overscanStartIndex, overscanEndIndex))
    }
  }

  const scrollToIndex = index => {
    const scrollTop = index * estimateSize
    parentRef.current.scrollTop = scrollTop
  }

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.addEventListener('scroll', onScroll, false)

      return () => {
        parentRef.current.removeEventListener('scroll', onScroll, false)
      }
    }
  }, [])

  return {
    totalSize: count * estimateSize,
    virtualItems,
  }
}

export default App
