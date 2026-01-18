"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { 
  Upload, 
  File, 
  Trash2, 
  Loader2, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video,
  Calendar,
  Megaphone,
  Youtube,
  DollarSign,
  Radio,
  Plus,
  Edit,
  Save,
  X
} from "lucide-react";

type ChurchContent = {
  id: string;
  type: 'event' | 'announcement' | 'sermon' | 'blog' | 'music' | 'livestream';
  title: string;
  description?: string;
  file_path?: string;
  public_url?: string;
  youtube_url?: string;
  youtube_playlist_url?: string;
  file_type?: string;
  size_bytes?: number;
  created_at: string;
  metadata?: Record<string, any>;
};

type TitheLyConfig = {
  churchId: string;
  api_key?: string;
  account_id?: string;
  enabled: boolean;
};

export function ChurchContentManager() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [content, setContent] = useState<ChurchContent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('premium');
  const [titheLyConfig, setTitheLyConfig] = useState<TitheLyConfig | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ChurchContent>>({});

  // Helper to get or create the church record
  const fetchChurchRecord = useCallback(async () => {
    if (!organization?.id) return null;

    try {
      const { data: existing, error: findError } = await supabase
        .from("churches")
        .select("id, subscription_plan")
        .eq("clerk_org_id", organization.id)
        .single();

      if (existing) {
        setChurchId(existing.id);
        setSubscriptionPlan(existing.subscription_plan || 'basic');
        return existing.id;
      }

      if (findError && findError.code === "PGRST116") {
        const { data: created, error: createError } = await supabase
          .from("churches")
          .insert([{
            clerk_org_id: organization.id,
            name: organization.name,
            subscription_plan: 'premium',
          }])
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

  const fetchContent = useCallback(async () => {
    if (!churchId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("church_content")
      .select("*")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching content:", error);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  }, [churchId]);

  const fetchTitheLyConfig = useCallback(async () => {
    if (!churchId) return;
    const { data, error } = await supabase
      .from("tithe_ly_config")
      .select("*")
      .eq("church_id", churchId)
      .single();

    if (data && !error) {
      setTitheLyConfig(data);
    }
  }, [churchId]);

  useEffect(() => {
    if (organization?.id) {
      fetchChurchRecord().then((id) => {
        if (id) {
          fetchContent();
          if (subscriptionPlan === 'growth' || subscriptionPlan === 'premium') {
            fetchTitheLyConfig();
          }
        }
      });
    }
  }, [organization?.id, fetchChurchRecord, fetchContent, fetchTitheLyConfig, subscriptionPlan]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: ChurchContent['type']) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!organization?.id || !churchId || !user?.id) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${organization.id}/${type}/${fileName}`;

    try {
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("church-content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("church-content")
        .getPublicUrl(filePath);

      // Save to DB
      const { error: dbError } = await supabase.from("church_content").insert([{
        church_id: churchId,
        type,
        title: file.name,
        file_path: filePath,
        public_url: publicUrl,
        file_type: file.type,
        size_bytes: file.size,
        uploaded_by: user.id,
      }]);

      if (dbError) throw dbError;
      fetchContent();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddContent = async (type: ChurchContent['type'], data: Partial<ChurchContent>) => {
    if (!churchId || !user?.id) return;

    try {
      const { error } = await supabase.from("church_content").insert([{
        church_id: churchId,
        type,
        title: data.title,
        description: data.description,
        youtube_url: data.youtube_url,
        youtube_playlist_url: data.youtube_playlist_url,
        uploaded_by: user.id,
      }]);

      if (error) throw error;
      fetchContent();
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content.");
    }
  };

  const handleUpdateContent = async (id: string, data: Partial<ChurchContent>) => {
    if (!churchId) return;

    try {
      const { error } = await supabase
        .from("church_content")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      fetchContent();
      setEditingItem(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating content:", error);
      alert("Failed to update content.");
    }
  };

  const handleDelete = async (item: ChurchContent) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    
    try {
      // Delete from Storage if file exists
      if (item.file_path) {
        const { error: storageError } = await supabase.storage
          .from("church-content")
          .remove([item.file_path]);
        if (storageError) throw storageError;
      }

      // Delete from DB
      const { error: dbError } = await supabase
        .from("church_content")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;
      setContent((prev) => prev.filter((c) => c.id !== item.id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete.");
    }
  };

  const saveTitheLyConfig = async (config: Partial<TitheLyConfig>) => {
    if (!churchId) return;

    try {
      const { error } = titheLyConfig
        ? await supabase
            .from("tithe_ly_config")
            .update(config)
            .eq("church_id", churchId)
        : await supabase
            .from("tithe_ly_config")
            .insert([{ ...config, churchId }]);

      if (error) throw error;
      fetchTitheLyConfig();
      alert("Tithe.ly configuration saved!");
    } catch (error) {
      console.error("Error saving Tithe.ly config:", error);
      alert("Failed to save configuration.");
    }
  };

  const getIcon = (type: string, item?: ChurchContent) => {
    if (item?.youtube_url || item?.youtube_playlist_url) return <Youtube className="h-5 w-5 text-red-500" />;
    if (type === 'event') return <Calendar className="h-5 w-5 text-blue-500" />;
    if (type === 'announcement') return <Megaphone className="h-5 w-5 text-amber-500" />;
    if (type === 'sermon') return <Video className="h-5 w-5 text-red-500" />;
    if (type === 'blog') return <FileText className="h-5 w-5 text-green-500" />;
    if (type === 'music') return <Music className="h-5 w-5 text-purple-500" />;
    if (type === 'livestream') return <Radio className="h-5 w-5 text-orange-500" />;
    if (item?.file_type?.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  if (!organization) return null;

  const renderBasicPlan = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Events & Announcements</h3>
        
        {/* Event Upload */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Upload Event</h4>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => handleUpload(e, 'event')}
            className="hidden"
            id="event-upload"
            disabled={uploading}
          />
          <label
            htmlFor="event-upload"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background cursor-pointer hover:bg-foreground/90"
          >
            <Calendar className="h-4 w-4" />
            Upload Event File
          </label>
        </div>

        {/* Announcement Upload */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Upload Announcement</h4>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => handleUpload(e, 'announcement')}
            className="hidden"
            id="announcement-upload"
            disabled={uploading}
          />
          <label
            htmlFor="announcement-upload"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background cursor-pointer hover:bg-foreground/90"
          >
            <Megaphone className="h-4 w-4" />
            Upload Announcement
          </label>
        </div>

        {/* Content List */}
        <div className="space-y-3">
          {content
            .filter(item => item.type === 'event' || item.type === 'announcement')
            .map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  {getIcon(item.type, item)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  {item.public_url && (
                    <a
                      href={item.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-700 hover:underline mt-1 block"
                    >
                      View File
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-foreground/40 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderGrowthPlan = () => (
    <div className="space-y-8">
      {/* Sermons Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Sermons</h3>
        <div className="bg-white p-4 rounded-lg border mb-4">
          <h4 className="text-sm font-medium mb-3">Add Sermon</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Sermon Title"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <textarea
              placeholder="Sermon Description"
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={3}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <input
              type="url"
              placeholder="YouTube Link"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) => setEditForm({ ...editForm, youtube_url: e.target.value })}
            />
            <button
              onClick={() => {
                if (editForm.title && editForm.youtube_url) {
                  handleAddContent('sermon', editForm);
                  setEditForm({});
                }
              }}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Add Sermon
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {content.filter(item => item.type === 'sermon').map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
              <Youtube className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-foreground/70 mt-1">{item.description}</p>
                )}
                {item.youtube_url && (
                  <a
                    href={item.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:underline mt-1 block"
                  >
                    Watch on YouTube
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="text-foreground/40 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blog/News Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Blog & News</h3>
        <div className="bg-white p-4 rounded-lg border mb-4">
          <h4 className="text-sm font-medium mb-3">Add Blog Post</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <textarea
              placeholder="Post Content"
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={4}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <button
              onClick={() => {
                if (editForm.title && editForm.description) {
                  handleAddContent('blog', editForm);
                  setEditForm({});
                }
              }}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Add Post
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {content.filter(item => item.type === 'blog').map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-foreground/40 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-foreground/70">{item.description}</p>
              <p className="text-xs text-foreground/50 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tithe.ly Integration */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tithe.ly Integration</h3>
        <div className="bg-white p-4 rounded-lg border">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Tithe.ly Account ID</label>
              <input
                type="text"
                placeholder="Enter your Tithe.ly Account ID"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                defaultValue={titheLyConfig?.account_id || ''}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">API Key (Optional)</label>
              <input
                type="password"
                placeholder="Enter your API key"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                defaultValue={titheLyConfig?.api_key || ''}
              />
            </div>
            <button
              onClick={() => {
                const accountId = (document.querySelector('input[placeholder*="Account ID"]') as HTMLInputElement)?.value;
                const apiKey = (document.querySelector('input[placeholder*="API key"]') as HTMLInputElement)?.value;
                saveTitheLyConfig({
                  account_id: accountId,
                  api_key: apiKey,
                  enabled: true
                });
              }}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Calendar</h3>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-foreground/70">Calendar integration coming soon...</p>
        </div>
      </div>
    </div>
  );

  const renderPremiumPlan = () => (
    <div className="space-y-8">
      {/* All Growth Plan Features */}
      {renderGrowthPlan()}

      {/* Music Playlist */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Music Playlist</h3>
        <div className="bg-white p-4 rounded-lg border mb-4">
          <h4 className="text-sm font-medium mb-3">Add Music</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Option 1: YouTube Playlist</label>
              <input
                type="url"
                placeholder="YouTube Playlist URL"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                onChange={(e) => setEditForm({ ...editForm, youtube_playlist_url: e.target.value })}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-foreground/50">Or</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Option 2: Upload Music File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleUpload(e, 'music')}
                className="hidden"
                id="music-upload"
                disabled={uploading}
              />
              <label
                htmlFor="music-upload"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background cursor-pointer hover:bg-foreground/90 mt-1"
              >
                <Music className="h-4 w-4" />
                Upload Music File
              </label>
            </div>
            <button
              onClick={() => {
                if (editForm.youtube_playlist_url) {
                  handleAddContent('music', { title: 'Music Playlist', youtube_playlist_url: editForm.youtube_playlist_url });
                  setEditForm({});
                }
              }}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Add Playlist
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {content.filter(item => item.type === 'music').map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
              <Music className="h-5 w-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.title}</p>
                {item.youtube_playlist_url && (
                  <a
                    href={item.youtube_playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:underline mt-1 block"
                  >
                    Open Playlist
                  </a>
                )}
                {item.public_url && (
                  <audio controls className="mt-2 w-full">
                    <source src={item.public_url} type={item.file_type} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="text-foreground/40 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Livestream */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Livestream</h3>
        <div className="bg-white p-4 rounded-lg border mb-4">
          <h4 className="text-sm font-medium mb-3">Configure Livestream</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Stream Title"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <input
              type="url"
              placeholder="YouTube or Facebook Live URL"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) => setEditForm({ ...editForm, youtube_url: e.target.value })}
            />
            <button
              onClick={() => {
                if (editForm.title && editForm.youtube_url) {
                  handleAddContent('livestream', editForm);
                  setEditForm({});
                }
              }}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
            >
              Set Livestream
            </button>
          </div>
        </div>

        {content.filter(item => item.type === 'livestream').map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
            <Radio className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.title}</p>
              <a
                href={item.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-700 hover:underline mt-1 block"
              >
                Watch Stream
              </a>
            </div>
            <button
              onClick={() => handleDelete(item)}
              className="text-foreground/40 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 bg-white/50">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          Current Plan: <span className="font-semibold">
            {subscriptionPlan === 'basic' ? 'The Digital Front Door' : 
             subscriptionPlan === 'growth' ? 'The Gospel Outreach' : 
             'The Ministry Ecosystem'}
          </span>
        </p>
      </div>

      {subscriptionPlan === 'basic' && renderBasicPlan()}
      {subscriptionPlan === 'growth' && renderGrowthPlan()}
      {subscriptionPlan === 'premium' && renderPremiumPlan()}
    </div>
  );
}
