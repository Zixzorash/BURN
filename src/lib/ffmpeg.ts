import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export async function initFFmpeg(ffmpeg: FFmpeg) {
  if (ffmpeg.loaded) return
  await ffmpeg.load({
    coreURL: toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.10/ffmpeg-core.js', 'text/javascript'),
    wasmURL: toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.10/ffmpeg-core.wasm', 'application/wasm'),
    workerURL: toBlobURL('https://unpkg.com/@ffmpeg/core-mt@0.12.10/ffmpeg-core.worker.js', 'text/javascript')
  })
}
