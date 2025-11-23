import { useState } from 'react'
import Uppy from '@uppy/core'
import GoogleDrive from '@uppy/google-drive'
import Url from '@uppy/url'
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/google-drive/dist/style.min.css'

interface Props {
  onVideoSelect: (file: File) => void
  onSubSelect: (file: File) => void
}

export default function UploadZone({ onVideoSelect, onSubSelect }: Props) {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 2 },
    autoProceed: true,
  })
    .use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' })
    .use(Url, { companionUrl: 'https://companion.uppy.io' })

  uppy.on('file-added', (file) => {
    if (file.type?.includes('video')) onVideoSelect(file.data as File)
    if (file.extension.match(/srt|ass|vtt|ssa/i)) onSubSelect(file.data as File)
  })

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">อัปโหลดวิดีโอ + ซับไตเติ้ล</h3>
      <Dashboard
        uppy={uppy}
        plugins={['GoogleDrive', 'Url']}
        width="100%"
        height="400px"
        proudlyDisplayPoweredByUppy={false}
        locale={{
          strings: {
            dropHereOr: 'ลากไฟล์มาวาง หรือ %{browse}',
            browse: 'เลือกจากเครื่อง / Google Drive',
          },
        }}
      />
    </div>
  )
}
