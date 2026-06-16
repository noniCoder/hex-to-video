import { useEffect, useRef } from 'react'

interface Props {
  url: string
  onDownload: () => void
}

export function VideoPlayer({ url, onDownload }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => {}) 
  }, [url])

  return (
    <div className="flex flex-col gap-3">
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full rounded-xl bg-black max-h-120"
      />
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="rounded-lg border border-zinc-700 px-4 py-1.5
                     text-sm text-zinc-300 hover:text-white transition-colors"
        >
          ⬇ Download
        </button>
      </div>
    </div>
  )
}