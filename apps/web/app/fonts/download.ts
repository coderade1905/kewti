export interface DownloadableFile {
  path: string
  type: string
  variant?: string
}

export interface ZipEntry {
  name: string
  data: Uint8Array
}

const BASE_URL = process.env.NEXT_PUBLIC_REGISTRY || "localhost:3333"

const ZIP_UTF8_FLAG = 0x0800
const ZIP_STORED = 0
const DOS_TIME = 0
const DOS_DATE = 0x2821 // 2000-01-01

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)

  for (let i = 0; i < 256; i++) {
    let value = i

    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }

    table[i] = value >>> 0
  }

  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff

  for (const byte of bytes) {
    const tableValue = CRC_TABLE[(crc ^ byte) & 0xff]

    crc = (tableValue ?? 0) ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

export const getFontFileUrl = (path: string): string => `${BASE_URL}/${path}`

export const getFileName = (path: string): string => {
  const cleanPath = path.split("?")[0]?.split("#")[0] ?? path
  const segments = cleanPath.split("/")
  const fileName = segments[segments.length - 1]

  return fileName || "download"
}

async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`)
  }

  return response.blob()
}

function saveBlob(blob: Blob, fileName: string): void {
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = href
  link.download = fileName
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => URL.revokeObjectURL(href), 1000)
}

export async function downloadRemoteFile(
  path: string,
  fileName: string = getFileName(path)
): Promise<void> {
  saveBlob(await fetchBlob(getFontFileUrl(path)), fileName)
}

export function createZipBlob(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder()
  const localChunks: Uint8Array[] = []
  const centralChunks: Uint8Array[] = []
  let localOffset = 0

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name)
    const size = entry.data.length
    const checksum = crc32(entry.data)

    const local = new Uint8Array(30 + nameBytes.length)
    const localView = new DataView(local.buffer)

    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(4, 20, true)
    localView.setUint16(6, ZIP_UTF8_FLAG, true)
    localView.setUint16(8, ZIP_STORED, true)
    localView.setUint16(10, DOS_TIME, true)
    localView.setUint16(12, DOS_DATE, true)
    localView.setUint32(14, checksum, true)
    localView.setUint32(18, size, true)
    localView.setUint32(22, size, true)
    localView.setUint16(26, nameBytes.length, true)
    localView.setUint16(28, 0, true)
    local.set(nameBytes, 30)

    const central = new Uint8Array(46 + nameBytes.length)
    const centralView = new DataView(central.buffer)

    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(8, ZIP_UTF8_FLAG, true)
    centralView.setUint16(10, ZIP_STORED, true)
    centralView.setUint16(12, DOS_TIME, true)
    centralView.setUint16(14, DOS_DATE, true)
    centralView.setUint32(16, checksum, true)
    centralView.setUint32(20, size, true)
    centralView.setUint32(24, size, true)
    centralView.setUint16(28, nameBytes.length, true)
    centralView.setUint16(30, 0, true)
    centralView.setUint16(32, 0, true)
    centralView.setUint16(34, 0, true)
    centralView.setUint16(36, 0, true)
    centralView.setUint32(38, 0, true)
    centralView.setUint32(42, localOffset, true)
    central.set(nameBytes, 46)

    localChunks.push(local, entry.data)
    centralChunks.push(central)
    localOffset += local.length + size
  }

  const centralSize = centralChunks.reduce(
    (total, chunk) => total + chunk.length,
    0
  )

  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)

  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(4, 0, true)
  endView.setUint16(6, 0, true)
  endView.setUint16(8, entries.length, true)
  endView.setUint16(10, entries.length, true)
  endView.setUint32(12, centralSize, true)
  endView.setUint32(16, localOffset, true)
  endView.setUint16(20, 0, true)

  return new Blob([...localChunks, ...centralChunks, end] as BlobPart[], {
    type: "application/zip",
  })
}

export async function downloadFilesAsZip(
  files: DownloadableFile[],
  zipName: string
): Promise<void> {
  const entries = await Promise.all(
    files.map(async (file) => {
      const blob = await fetchBlob(getFontFileUrl(file.path))
      const data = new Uint8Array(await blob.arrayBuffer())

      return { name: getFileName(file.path), data }
    })
  )

  saveBlob(
    createZipBlob(entries),
    zipName.endsWith(".zip") ? zipName : `${zipName}.zip`
  )
}
