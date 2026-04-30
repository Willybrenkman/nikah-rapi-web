// src/components/FileUpload.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function FileUpload({ weddingId, folder = 'general', onUploadComplete }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${weddingId}/${folder}/${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to 'wedding-docs' bucket
      const { error: uploadError } = await supabase.storage
        .from('wedding-docs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-docs')
        .getPublicUrl(filePath)

      toast.success('File berhasil diunggah! 📁')
      if (onUploadComplete) onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Error uploading:', error)
      toast.error('Gagal mengunggah file. Pastikan bucket "wedding-docs" sudah dibuat.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 cursor-pointer bg-ivory border border-dusty-pink px-4 py-2 rounded-lg hover:bg-white transition-all shadow-sm">
        <span className="text-xl">{uploading ? '⏳' : '📎'}</span>
        <span className="text-xs font-bold text-brown-muted">
          {uploading ? 'Mengunggah...' : 'Unggah Kontrak/Bukti'}
        </span>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleUpload} 
          disabled={uploading}
          accept="image/*,application/pdf"
        />
      </label>
    </div>
  )
}
