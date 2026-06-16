import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import type { InputFormat, VideoMime, DecodeRequest } from '../types'

interface Props {
  onDecode: (req: DecodeRequest) => void
  loading: boolean
}

export function InputPanel({ onDecode, loading }: Props) {
  const [format, setFormat]   = useState<InputFormat>('auto')
  const [mime, setMime]       = useState<VideoMime>('video/mp4')
  const [value, setValue]     = useState('')
  const fileRef               = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setValue(e.target?.result as string ?? '')
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full h-48 rounded-xl border border-zinc-700 bg-zinc-900 p-3
                   font-mono text-sm text-zinc-200 resize-y outline-none
                   focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
        placeholder="Paste hex or base64 here…"
        value={value}
        onChange={e => setValue(e.target.value)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      />

      <div className="flex flex-wrap items-center gap-3">
        {/* Format toggle */}
        <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-sm">
          {(['auto', 'hex', 'base64'] as InputFormat[]).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 transition-colors ${
                format === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* MIME select */}
        <select
          value={mime}
          onChange={e => setMime(e.target.value as VideoMime)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5
                     text-sm text-zinc-300 outline-none cursor-pointer"
        >
          <option value="video/mp4">MP4</option>
          <option value="video/webm">WebM</option>
          <option value="video/ogg">OGG</option>
          <option value="video/quicktime">MOV</option>
        </select>

        {/* File picker */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700
                     px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Upload size={14} /> Load file
        </button>
        <input ref={fileRef} type="file" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

        {/* Convert */}
        <button
          onClick={() => onDecode({ raw: value, format, mime })}
          disabled={!value.trim() || loading}
          className="ml-auto rounded-lg bg-indigo-600 hover:bg-indigo-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     px-5 py-1.5 text-sm font-medium text-white transition-colors"
        >
          {loading ? 'Decoding…' : '▶ Convert & Play'}
        </button>
      </div>
    </div>
  )
}