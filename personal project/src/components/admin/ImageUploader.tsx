'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Check, Loader2, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const { toast, success } = useToast();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast('Image file size must be less than 5MB', 'error');
      return;
    }

    setUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
        success('Image uploaded to Cloudinary successfully!');
      } else {
        // If Cloudinary preset is not configured yet, convert file to local Data URL or advise
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            onChange(reader.result as string);
            toast('Loaded local preview image (Configure Cloudinary in .env for production storage)', 'info');
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChange(reader.result as string);
          toast('Loaded image preview (Configure Cloudinary in .env for production storage)', 'info');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-zinc-300 block text-[11px] uppercase tracking-wider">
          Watch Image (Cloudinary Storage) *
        </label>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'upload' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'url' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-2xl p-4 text-center bg-[#181a24] transition-all relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              <span className="text-[11px] text-zinc-300">Uploading image to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-1.5 pointer-events-none">
              <UploadCloud className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-200">
                Click or Drag & Drop watch photo
              </span>
              <span className="text-[10px] text-zinc-500">
                Auto-uploads to Cloudinary & saves secure image URL
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="w-full bg-[#181a24] border border-zinc-700 rounded-xl px-3.5 py-2.5 pl-9 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400"
          />
          <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-[#12141c] border border-zinc-800 rounded-xl">
          <img
            src={value}
            alt="Preview"
            className="w-12 h-12 object-cover rounded-lg bg-black/40 border border-zinc-700 shrink-0"
          />
          <div className="overflow-hidden text-left flex-1">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Image Loaded
            </span>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
