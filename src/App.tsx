import { useState, useRef } from 'react'
import Uppy from '@uppy/core'
import GoogleDrive from '@uppy/google-drive'
import Url from '@uppy/url'
import { Dashboard } from '@uppy/react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { Download, Save, Upload, Eye, Settings } from 'lucide-react'
import { initFFmpeg } from './lib/ffmpeg'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'

const ffmpeg = new FFmpeg()

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [subFile, setSubFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [status, setStatus] = useState('พร้อมใช้งาน')
  const [progress, setProgress] = useState(0)
  const [presets, setPresets] = useState<any[]>([])
  const [style, setStyle] = useState({
    font: 'Prompt',
    size: 48,
    color: '#FFFFFF',
    outline: 3,
    shadow: 2,
    position: 'bottom',
    marginV: 80,
    fps: '25'
  })

  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 2 },
    autoProceed: true
  })
    .use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' })
    .use(Url, { companionUrl: 'https://companion.uppy.io' })

  uppy.on('file-added', (file) => {
    if (file.type?.includes('video')) setVideoFile(file.data as File)
    if (file.extension.match(/srt|ass|vtt/)) setSubFile(file.data as File)
  })

  const generateASS = (srt: string) => {
    const lines = srt.split('\n')
    let events = ''
    let inDialogue = false
    for (const line of lines) {
      if (line.match(/^\d+$/)) inDialogue = true
      else if (line.includes('-->')) {
        const [start, end] = line.split(' --> ')
        events += `Dialogue: 0,${start.replace(',', '.')},${end.replace(',', '.')},Default,,0,0,0,,`
      }
      else if (inDialogue && line.trim() && !line.match(/^\d+$/)) {
        events += line + '\\N'
      }
    }
    return `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Alignment, MarginV
Style: Default,${style.font},${style.size},&H00${style.color.slice(1)},&H80000000,&H80000000,1,2,${style.marginV}

[Events]
${events}`
  }

  const burn = async () => {
    if (!videoFile || !subFile) return
    setStatus('กำลังโหลด FFmpeg...')
    await initFFmpeg(ffmpeg)

    setStatus('กำลังประมวลผล...')
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))
    
    let subContent = await subFile.text()
    if (subFile.name.endsWith('.srt')) subContent = generateASS(subContent)
    await ffmpeg.writeFile('sub.ass', subContent)

    ffmpeg.on('progress', ({ progress }) => setProgress(Math.round(progress * 100)))

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', `ass=sub.ass,fps=${style.fps}`,
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
      '-c:a', 'copy', 'output.mp4'
    ])

    const data = await ffmpeg.readFile('output.mp4')
    const blob = new Blob([data.buffer], { type: 'video/mp4' })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)

    const a = document.createElement('a')
    a.href = url
    a.download = `ซับติด_${videoFile.name}`
    a.click()
    setStatus('เสร็จเรียบร้อย!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center my-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
          ThaiSubBurner X
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl mb-4 flex items-center gap-3">
              <Upload className="w-8 h-8" /> อัปโหลดไฟล์
            </h2>
            <Dashboard uppy={uppy} plugins={['GoogleDrive', 'Url']} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl mb-4 flex items-center gap-3">
              <Settings className="w-8 h-8" /> ตั้งค่ารูปแบบซับ
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <select value={style.font} onChange={e => setStyle({...style, font: e.target.value})} 
                className="p-3 rounded-lg bg-white/20">
                <option>Prompt</option>
                <option>Sarabun</option>
                <option>Kanit</option>
              </select>
              <input type="number" value={style.size} onChange={e => setStyle({...style, size: +e.target.value})}
                className="p-3 rounded-lg bg-white/20" placeholder="ขนาดตัวอักษร" />
              <input type="color" value={style.color} onChange={e => setStyle({...style, color: e.target.value})}
                className="h-12 rounded-lg" />
              <select value={style.fps} onChange={e => setStyle({...style, fps: e.target.value})}
                className="p-3 rounded-lg bg-white/20">
                <option value="23.976">23.976</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-center my-10">
          <button onClick={burn} disabled={!videoFile || !subFile}
            className="px-16 py-6 text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:scale-105 transition disabled:opacity-50">
            Burn ซับลงวิดีโอเลย!
          </button>
        </div>

        {previewUrl && (
          <div className="bg-black/50 rounded-2xl p-6">
            <h2 className="text-3xl mb-4 flex items-center gap-3 justify-center">
              <Eye className="w-10 h-10" /> ตัวอย่างผลลัพธ์
            </h2>
            <video src={previewUrl} controls className="w-full rounded-xl" />
          </div>
        )}

        <div className="text-center text-xl mt-8">{status} {progress > 0 && `${progress}%`}</div>
      </div>
    </div>
  )
}
