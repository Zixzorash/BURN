import { Save, Download, Upload } from 'lucide-react'

interface Style {
  font: string
  size: number
  color: string
  outline: number
  shadow: number
  position: 'top' | 'bottom'
  marginV: number
  fps: string
}

interface Props {
  style: Style
  setStyle: (style: Style) => void
  savePreset: () => void
  loadPreset: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function StyleEditor({ style, setStyle, savePreset, loadPreset }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        ตั้งค่ารูปแบบซับไตเติ้ล
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">ฟอนต์</label>
          <select
            value={style.font}
            onChange={(e) => setStyle({ ...style, font: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20"
          >
            <option>Prompt</option>
            <option>Sarabun</option>
            <option>Kanit</option>
            <option>TH Sarabun New</option>
            <option>Cordia New</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">ขนาด</label>
          <input
            type="number"
            value={style.size}
            onChange={(e) => setStyle({ ...style, size: +e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">สีตัวอักษร</label>
          <input
            type="color"
            value={style.color}
            onChange={(e) => setStyle({ ...style, color: e.target.value })}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">ขอบ (Outline)</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={style.outline}
            onChange={(e) => setStyle({ ...style, outline: +e.target.value })}
            className="w-full"
          />
          <span className="text-xs">{style.outline}px</span>
        </div>

        <div>
          <label className="block text-sm mb-1">ตำแหน่ง</label>
          <select
            value={style.position}
            onChange={(e) => setStyle({ ...style, position: e.target.value as 'top' | 'bottom' })}
            className="w-full p-3 rounded-lg bg-white/20"
          >
            <option value="bottom">ล่าง</option>
            <option value="top">บน</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Frame Rate</label>
          <select
            value={style.fps}
            onChange={(e) => setStyle({ ...style, fps: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/20"
          >
            <option value="23.976">23.976 (หนังฝรั่ง)</option>
            <option value="24">24</option>
            <option value="25">25 (ทีวีไทย)</option>
            <option value="29.97">29.97</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={savePreset}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition"
        >
          <Save size={20} /> บันทึก Preset
        </button>
        <label className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 cursor-pointer transition">
          <Upload size={20} /> โหลด Preset
          <input type="file" accept=".json" onChange={loadPreset} className="hidden" />
        </label>
      </div>
    </div>
  )
}