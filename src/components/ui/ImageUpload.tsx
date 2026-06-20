'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  /** Current image URL (or null/empty when none). */
  value: string | null;
  /** Called with the new public URL after upload, or null when removed. */
  onChange: (url: string | null) => void;
  label?: string;
}

// Original-file cap (before compression). Matches the /api/upload-image limit.
const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({ value, onChange, label = 'Featured image' }: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please choose an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      toast({
        title: 'Image too large',
        description: 'Please choose an image under 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Compress/resize before upload so stored images stay small (~1MB max).
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append('file', compressed, file.name || 'image.jpg');

      const response = await fetch('/api/upload-image', { method: 'POST', body: formData });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }

      const { url } = await response.json();
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="max-h-64 w-auto max-w-full rounded-lg border border-gray-200 object-contain"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-700"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {isUploading ? 'Uploading…' : 'Upload image'}
        </Button>
      )}
      <p className="text-xs text-gray-400">JPG, PNG, GIF or WEBP. Up to 10MB — large images are compressed automatically.</p>
    </div>
  );
}
