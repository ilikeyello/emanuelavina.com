'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X, Flag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FlaggedContentManagerProps {
  orgId: string;
}

type ContentType = 'bulletin_post' | 'bulletin_comment' | 'prayer_request' | 'prayer_comment';

interface ContentReport {
  id: number;
  content_type: ContentType;
  content_id: number;
  reason: string | null;
  reporter_id: string | null;
  created_at: string;
  content: Record<string, any> | null;
}

const LABELS: Record<ContentType, string> = {
  bulletin_post: 'Bulletin Post',
  bulletin_comment: 'Bulletin Comment',
  prayer_request: 'Prayer Request',
  prayer_comment: 'Prayer Comment',
};

function getExcerpt(report: ContentReport): { title: string | null; body: string; author: string | null } {
  const content = report.content;
  if (!content) return { title: null, body: '(content already removed)', author: null };

  switch (report.content_type) {
    case 'bulletin_post':
      return { title: content.title, body: content.content, author: content.author_name };
    case 'bulletin_comment':
      return { title: null, body: content.content, author: content.author_name };
    case 'prayer_request':
      return {
        title: content.title,
        body: content.description,
        author: content.is_anonymous ? 'Anonymous' : content.user_name,
      };
    case 'prayer_comment':
      return { title: null, body: content.content, author: content.author_name };
    default:
      return { title: null, body: '', author: null };
  }
}

export default function FlaggedContentManager({ orgId }: FlaggedContentManagerProps) {
  const { toast } = useToast();
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [orgId]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/flagged-content?orgId=${orgId}`);
      if (response.ok) {
        setReports(await response.json());
      } else {
        toast({ title: 'Error', description: 'Failed to load flagged content', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      toast({ title: 'Error', description: 'Failed to load flagged content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (report: ContentReport) => {
    if (!confirm('Delete this content? This cannot be undone.')) return;
    const key = `${report.content_type}-${report.content_id}`;
    setBusyKey(key);
    try {
      const res = await fetch(
        `/api/flagged-content?contentType=${report.content_type}&contentId=${report.content_id}&mode=delete`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        toast({ title: 'Deleted', description: 'The content was removed.' });
        fetchReports();
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: err.error || 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } finally {
      setBusyKey(null);
    }
  };

  const handleDismiss = async (report: ContentReport) => {
    const key = `${report.content_type}-${report.content_id}`;
    setBusyKey(key);
    try {
      const res = await fetch(
        `/api/flagged-content?contentType=${report.content_type}&contentId=${report.content_id}&mode=dismiss`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        toast({ title: 'Dismissed', description: 'Report removed, content kept.' });
        fetchReports();
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: err.error || 'Failed to dismiss', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to dismiss', variant: 'destructive' });
    } finally {
      setBusyKey(null);
    }
  };

  if (loading) return <div>Loading flagged content...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Flagged Content</h3>
        <p className="text-sm text-muted-foreground">Comments and posts reported as inappropriate by users.</p>
      </div>

      {reports.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No flagged content. You're all caught up.</p>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => {
            const { title, body, author } = getExcerpt(report);
            const key = `${report.content_type}-${report.content_id}`;
            const busy = busyKey === key;
            return (
              <div key={report.id} className="border rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start sm:gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                      <Flag className="h-3 w-3" />
                      {LABELS[report.content_type]}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      Reported {new Date(report.created_at).toLocaleString()}
                    </span>
                  </div>
                  {title && <p className="font-semibold">{title}</p>}
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{body}</p>
                  {author && <p className="text-xs text-muted-foreground">By: {author}</p>}
                  {report.reason && <p className="text-xs text-muted-foreground">Reason: {report.reason}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => handleDismiss(report)}>
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => handleDelete(report)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
