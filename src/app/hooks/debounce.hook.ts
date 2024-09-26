import { useEffect, useRef, useState } from "react"

export const useDebounceState = (defaultValue: boolean, time: number, callback?: (value: boolean) => Promise<void>) => {
  const [active, setActive] = useState(defaultValue)
  const activeRef = useRef(defaultValue)
  const timeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setActive(defaultValue)
  }, [defaultValue])

  const onChange = () => {
    setActive(prev => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
      timeout.current = setTimeout(() => {
        if (activeRef.current === !prev) {
          return
        }
        activeRef.current = !prev
        callback?.(!prev).then(() => { }).catch(() => {
          activeRef.current = prev
          setActive(prev)
        })
      }, time);
      return !prev
    })
  }

  return { active, onChange, setActive }
}