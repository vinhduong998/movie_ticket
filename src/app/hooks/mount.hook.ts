import { useEffect, useRef } from "react"

export const useMounted = <T>(_function: Promise<T>, callback: (res: T) => void, deps: any[] = []) => {
  const mounted = useRef(false)

  useEffect(() => {
    const callFunction = async () => {
      try {
        const res = await _function;
        if (mounted.current) {
          callback(res)
        }
      } catch (error) {

      }
    }
    callFunction()

    return () => {
      mounted.current = false
    }
  }, [...deps])
}