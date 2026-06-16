import { useVideoDecoder } from './hooks/useVideoDecoder'
import { InputPanel }      from './components/InputPanel'
import { VideoPlayer }     from './components/VideoPlayer'

export default function App() {
  const { state, decode } = useVideoDecoder()

  const handleDownload = () => {
    if (state.status !== 'ready') return
    const a = document.createElement('a')
    a.href = state.url
    a.download = 'video.mp4'
    a.click()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold">Hex / Base64 → Video</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Decodes on a background thread. Supports files of any size.
          </p>
        </div>

        <InputPanel
          onDecode={decode}
          loading={state.status === 'decoding'}
        />

        {state.status === 'decoding' && (
          <p className="text-sm text-indigo-400 animate-pulse">Decoding…</p>
        )}

        {state.status === 'error' && (
          <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
            {state.message}
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <div className="flex gap-4 text-xs text-zinc-500">
              <span>Format: <b className="text-zinc-300">{state.detectedFormat}</b></span>
              <span>Size: <b className="text-zinc-300">{(state.bytes / 1024).toFixed(1)} KB</b></span>
            </div>
            <VideoPlayer url={state.url} onDownload={handleDownload} />
          </>
        )}
      </div>
    </div>
  )
}