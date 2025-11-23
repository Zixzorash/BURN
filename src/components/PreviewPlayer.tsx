import { useEffect, useRef } from 'react'

interface Props {
  url: string
}

export default function PreviewPlayer({ url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.currentTime = 30 // ข้ามไป 30 วินาทีเพื่อดูตัวอย่าง
  }, [url])

  if (!url) return null

  return (
    <div className="mt-8 bg-black/70 rounded-2xl p-4">
      <h3 className="text-2xl font-bold mb-4 text-center">ตัวอย่างผลลัพธ์ (Preview)</h3>
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full max-h-96 mx-auto rounded-xl shadow-2xl"
      />
      <p className="text-center mt-4 text-sm text-gray-400">
        ถ้าซับดูดีแล้ว กดดาวน์โหลดได้เลย!
      </p>
    </div>
  )
}