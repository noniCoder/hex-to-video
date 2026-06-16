export type InputFormat = 'hex' | 'base64' | 'auto'
export type VideoMime   = 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/quicktime'

export interface DecodeRequest {
  raw: string
  format: InputFormat
  mime: VideoMime   
}

export interface DecodeResult {
  ok: true
  url: string
  bytes: number
  detectedFormat: 'hex' | 'base64'
}

export interface DecodeError {
  ok: false
  message: string
}