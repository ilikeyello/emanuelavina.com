'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2, BookOpen, CalendarDays } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BIBLE_BOOKS } from '@/lib/bible-books';

// Optional overrides for the app's Verse of the Day. The app ships a built-in
// 366-reference yearly list and uses it for any date without a row here, so
// this tab is for picking a specific verse (a Sunday, a special service) —
// leaving it empty is perfectly fine.
interface VerseOfTheDay {
  id: number;
  verse_date: string;
  book: string;
  chapter: number;
  verse: number;
  end_verse: number | null;
  note_en: string | null;
  note_es: string | null;
}

function todayKey(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** 'YYYY-MM-DD' parses as UTC, which can render as the previous day. */
function formatDate(value: string): string {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function bookName(id: string): string {
  return BIBLE_BOOKS.find((b) => b.id === id)?.name ?? id;
}

export default function VersesOfTheDayManager() {
  const { toast } = useToast();
  const [verses, setVerses] = useState<VerseOfTheDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [verseDate, setVerseDate] = useState(todayKey());
  const [book, setBook] = useState('john');
  const [chapter, setChapter] = useState('3');
  const [verse, setVerse] = useState('16');
  const [endVerse, setEndVerse] = useState('');
  const [noteEn, setNoteEn] = useState('');
  const [noteEs, setNoteEs] = useState('');

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === book);

  const fetchVerses = useCallback(async () => {
    try {
      const response = await fetch('/api/verses-of-the-day');
      if (response.ok) setVerses(await response.json());
    } catch (error) {
      console.error('Error fetching verses of the day:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  const resetForm = () => {
    setVerseDate(todayKey());
    setBook('john');
    setChapter('3');
    setVerse('16');
    setEndVerse('');
    setNoteEn('');
    setNoteEs('');
  };

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/verses-of-the-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verse_date: verseDate,
          book,
          chapter,
          verse,
          end_verse: endVerse,
          note_en: noteEn.trim() || null,
          note_es: noteEs.trim() || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save the verse');

      toast({
        title: 'Verse set',
        description: `${bookName(book)} ${chapter}:${verse} will show on ${formatDate(verseDate)}.`,
      });
      resetForm();
      setShowForm(false);
      fetchVerses();
    } catch (error) {
      toast({
        title: 'Could not save',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Remove this verse? That date will fall back to the built-in yearly list.')) return;
    try {
      const response = await fetch(`/api/verses-of-the-day?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setVerses((current) => current.filter((v) => v.id !== id));
    } catch {
      toast({ title: 'Could not remove the verse', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Verse of the Day</h3>
          <p className="text-sm text-muted-foreground">
            The app already shows a different verse every day from a built-in yearly list. Set a
            verse here only when you want to override a specific date.
          </p>
        </div>
        <Button onClick={() => setShowForm((open) => !open)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Set a verse
        </Button>
      </div>

      {showForm && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="verse-date">Date</Label>
              <Input
                id="verse-date"
                type="date"
                value={verseDate}
                min={todayKey()}
                onChange={(e) => setVerseDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verse-book">Book</Label>
              <select
                id="verse-book"
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter('1');
                  setVerse('1');
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="verse-chapter">
                Chapter <span className="text-muted-foreground">(1–{selectedBook?.chapters})</span>
              </Label>
              <Input
                id="verse-chapter"
                type="number"
                min={1}
                max={selectedBook?.chapters}
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verse-number">Verse</Label>
              <Input
                id="verse-number"
                type="number"
                min={1}
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verse-end">
                Through <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="verse-end"
                type="number"
                min={1}
                placeholder="—"
                value={endVerse}
                onChange={(e) => setEndVerse(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="verse-note-en">Note in English (optional)</Label>
              <Textarea
                id="verse-note-en"
                rows={2}
                value={noteEn}
                onChange={(e) => setNoteEn(e.target.value)}
                placeholder="A short thought shown under the verse"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verse-note-es">Note in Spanish (optional)</Label>
              <Textarea
                id="verse-note-es"
                rows={2}
                value={noteEs}
                onChange={(e) => setNoteEs(e.target.value)}
                placeholder="Un pensamiento breve mostrado bajo el versículo"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The app shows this verse in whichever version the reader picked on the Bible page (KJV,
            RV1909 or SPNBES), so you only choose the reference — not the wording.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row [&>button]:w-full sm:[&>button]:w-auto">
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save verse
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {verses.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No verses set</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The app is showing today&apos;s verse from the built-in yearly list.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {verses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(item.verse_date)}
                  {item.verse_date === todayKey() && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Today
                    </span>
                  )}
                </div>
                <p className="mt-1 font-semibold">
                  {bookName(item.book)} {item.chapter}:{item.verse}
                  {item.end_verse ? `-${item.end_verse}` : ''}
                </p>
                {(item.note_en || item.note_es) && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {item.note_en || item.note_es}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(item.id)}
                aria-label="Remove verse"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
