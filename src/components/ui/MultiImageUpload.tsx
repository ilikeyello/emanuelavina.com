'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface MultiImageUploadProps {
  /** Photos in display order. The first one is the post's lead image. */
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  /** Guard rail against someone dropping an entire camera roll into one post. */
  maxImages?: number;
}

// Original-file cap (before compression). Matches the /api/upload-image limit.
const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_IMAGES = 10;

export default function MultiImageUpload({
  value,
  onChange,
  label = 'Photos',
  maxImages = DEFAULT_MAX_IMAGES,
}: MultiImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const images = Array.isArray(value) ? value : [];
  const isUploading = uploadingCount > 0;
  const remainingSlots = Math.max(0, maxImages - images.length);

  const uploadOne = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Skipped a file',
        description: `"${file.name}" isn't an image.`,
        variant: 'destructive',
      });
      return null;
    }
    if (file.size > MAX_INPUT_BYTES) {
      toast({
        title: 'Skipped a file',
        description: `"${file.name}" is over 10MB.`,
        variant: 'destructive',
      });
      return null;
    }

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
    return url as string;
  };

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const accepted = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast({
        title: `Only ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'} fit`,
        description: `A post holds up to ${maxImages}. The extra files were skipped.`,
      });
    }

    setUploadingCount(accepted.length);
    try {
      // Sequential rather than parallel: the picker's order is the order the
      // admin chose, and it keeps a batch of large photos from competing for
      // bandwidth and timing out.
      const uploaded: string[] = [];
      for (const file of accepted) {
        try {
          const url = await uploadOne(file);
          if (url) uploaded.push(url);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: 'Upload failed',
            description:
              error instanceof Error
                ? `${file.name}: ${error.message}`
                : `Could not upload ${file.name}.`,
            variant: 'destructive',
          });
        } finally {
          setUploadingCount((count) => Math.max(0, count - 1));
        }
      }
      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${label} ${index + 1}`} className="h-full w-full object-cover" />
              </div>

              {/* The first photo is what shows in notifications and on older
                  app builds, so make that position explicit. */}
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}

              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-700"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {images.length > 1 && (
                <div className="mt-1 flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    aria-label={`Move photo ${index + 1} earlier`}
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                    aria-label={`Move photo ${index + 1} later`}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading || remainingSlots === 0}
        className="gap-2"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {isUploading
          ? `Uploading ${uploadingCount} photo${uploadingCount === 1 ? '' : 's'}…`
          : images.length > 0
            ? 'Add more photos'
            : 'Upload photos'}
      </Button>

      <p className="text-xs text-gray-400">
        {images.length > 1
          ? `${images.length} photos — they'll appear as a swipeable carousel in the app. The first is the cover.`
          : 'Select several at once. Multiple photos become a swipeable carousel in the app.'}{' '}
        JPG, PNG, GIF or WEBP, up to 10MB each — large images are compressed automatically.
      </p>
    </div>
  );
}
