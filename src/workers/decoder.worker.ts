const ctx = self as any

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+|0x|-|:/gi, '')
  if (clean.length % 2 !== 0)
    throw new Error(`Odd hex length: ${clean.length} chars. Each byte needs exactly 2 hex digits.`)
  if (!/^[0-9a-fA-F]+$/.test(clean))
    throw new Error('Non-hex characters detected after stripping whitespace/prefixes.')

  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < clean.length; i += 2)
    bytes[i >> 1] = parseInt(clean.slice(i, i + 2), 16)
  return bytes
}

function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/\s+/g, '')
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++)
    bytes[i] = binary.charCodeAt(i)
  return bytes
}

function detect(raw: string): 'hex' | 'base64' {
  const s = raw.replace(/\s/g, '')
  if (/^[A-Za-z0-9+/]+=*$/.test(s) && s.length % 4 === 0) return 'base64'
  return 'hex'
}

ctx.onmessage = (e: MessageEvent) => {
  const { raw, format, mime } = e.data
  try {
    const detectedFormat = format === 'auto' ? detect(raw) : format
    const bytes = detectedFormat === 'hex' ? hexToBytes(raw) : base64ToBytes(raw)
    const buffer = bytes.buffer
    ctx.postMessage({ ok: true, buffer, detectedFormat, mime }, [buffer])
  } catch (err: any) {
    ctx.postMessage({ ok: false, message: err.message })
  }
}