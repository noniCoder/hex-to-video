import { useCallback, useRef, useState } from 'react'
import type { DecodeRequest } from '../types'

type State =
  | { status: 'idle' }
  | { status: 'decoding' }
  | { status: 'ready'; url: string; bytes: number; detectedFormat: string }
  | { status: 'error'; message: string }

export function useVideoDecoder() {
  const [state, setState] = useState<State>({ status: 'idle' })
  const workerRef = useRef<Worker | null>(null)
  const urlRef    = useRef<string | null>(null)

  const decode = useCallback((req: DecodeRequest) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }

    workerRef.current?.terminate()

    setState({ status: 'decoding' })

    const worker = new Worker(
      new URL('../workers/decoder.worker.ts', import.meta.url),
      { type: 'module' }
    )
    workerRef.current = worker

    worker.onmessage = (e) => {
      const data = e.data
      if (!data.ok) {
        setState({ status: 'error', message: data.message })
        return
      }
      const blob = new Blob([data.buffer], { type: data.mime })
      const url  = URL.createObjectURL(blob)
      urlRef.current = url
      setState({
        status: 'ready',
        url,
        bytes: data.buffer.byteLength,
        detectedFormat: data.detectedFormat,
      })
      worker.terminate()
    }

    worker.onerror = (e) => {
      setState({ status: 'error', message: e.message })
      worker.terminate()
    }

    worker.postMessage(req)
  }, [])

  const reset = useCallback(() => {
    workerRef.current?.terminate()
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setState({ status: 'idle' })
  }, [])

  return { state, decode, reset }
}