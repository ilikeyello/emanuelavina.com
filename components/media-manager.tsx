"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { Upload, File, Trash2, Loader2, Image as ImageIcon, FileText, Music, Video } from "lucide-react";

type MediaItem = {
  id: string;
  title: string;
  file_path: string;
  public_url: string;
  file_type: string;
  size_bytes: number;
  created_at: string;
};

export function MediaManager({ planCode }: { planCode?: string | null }) {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);

  // Helper to get or create the church record for this Org
  const fetchChurchRecord = useCallback(async () => {
    if (!organization?.id) return;

    try {
      // Try to find existing church
      const { data: existing, error: findError } = await supabase
        .from("churches")
        .select("id, subscription_plan")
        .eq("clerk_org_id", organization.id)
        .single();

      if (existing) {
        setChurchId(existing.id);
        
        // If a plan was selected from pricing and it's different/new, update it
        // (Simple logic: if user clicked a plan button, they probably want that plan)
        if (planCode && existing.subscription_plan !== planCode) {
           await supabase
            .from("churches")
            .update({ subscription_plan: planCode })
            .eq("id", existing.id);
        }
        return existing.id;
      }

      // If not found, create it
      if (findError && findError.code === "PGRST116") {
        const { data: created, error: createError } = await supabase
          .from("churches")
          .insert([
            {
              clerk_org_id: organization.id,
              name: organization.name,
              subscription_plan: planCode || "basic", 
            },
          ])
          .select("id")
          .single();

        if (createError) {
          console.error("Error creating church record:", createError);
          return null;
        }
        setChurchId(created.id);
        return created.id;
      }
    } catch (err) {
      console.error("Error fetching church record:", err);
    }
    return null;
  }, [organization?.id, organization?.name, planCode]);

  const fetchMedia = useCallback(async () => {
    if (!churchId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("church_media")
      .select("*")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching media:", error);
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  }, [churchId]);

  useEffect(() => {
    if (organization?.id) {
      fetchChurchRecord().then((id) => {
        if (id) fetchMedia();
      });
    }
  }, [organization?.id, fetchChurchRecord, fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!organization?.id || !churchId || !user?.id) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${organization.id}/${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("church-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("church-media")
        .getPublicUrl(filePath);

      // 3. Save Metadata to DB
      const { error: dbError } = await supabase.from("church_media").insert([
        {
          church_id: churchId,
          title: file.name,
          file_path: filePath,
          public_url: publicUrl,
          file_type: file.type,
          size_bytes: file.size,
          uploaded_by: user.id,
        },
      ]);

      if (dbError) throw dbError;

      // Refresh list
      fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("church-media")
        .remove([item.file_path]);

      if (storageError) throw storageError;

      // 2. Delete from DB
      const { error: dbError } = await supabase
        .from("church_media")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;

      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete file.");
    }
  };

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (type.startsWith("audio/")) return <Music className="h-5 w-5 text-purple-500" />;
    if (type.startsWith("video/")) return <Video className="h-5 w-5 text-red-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  if (!organization) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Media Library</h3>
        <div className="relative">
          <input
            type="file"
            id="media-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label
            htmlFor="media-upload"
            className={`flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </label>
        </div>
      </div>

      {loading && media.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 bg-white/50">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
        </div>
      ) : media.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-white/50 text-foreground/60">
          <File className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-sm">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-start gap-3 rounded-xl border border-border/50 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                {getIcon(item.file_type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground" title={item.title}>
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-foreground/50">
                  <span>{(item.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <a
                  href={item.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-amber-700 hover:underline"
                >
                  View File
                </a>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="absolute right-2 top-2 rounded-lg p-1.5 text-foreground/40 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
