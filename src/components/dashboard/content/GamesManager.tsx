'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ExternalLink, Trash2, Edit, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TriviaLevel {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  question_count: number;
}

interface WordSearchLevel {
  id: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  rows: number;
  cols: number;
  words: { id: string; word_en: string; word_es: string }[];
}

interface TriviaQuestion {
  id: string;
  level_id: string;
  question_en: string;
  question_es: string;
  options_en: string[];
  options_es: string[];
  correct_answer: number;
  category?: string;
  reference?: string;
}

interface GamesManagerProps {
  orgId: string;
}

export default function GamesManager({ orgId }: GamesManagerProps) {
  const { toast } = useToast();
  const [triviaLevels, setTriviaLevels] = useState<TriviaLevel[]>([]);
  const [wordSearchLevels, setWordSearchLevels] = useState<WordSearchLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTriviaModal, setOpenTriviaModal] = useState(false);
  const [openWsModal, setOpenWsModal] = useState(false);
  
  // Nested Management State
  const [selectedTriviaLevel, setSelectedTriviaLevel] = useState<TriviaLevel | null>(null);
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TriviaQuestion | null>(null);

  const [selectedWsLevel, setSelectedWsLevel] = useState<WordSearchLevel | null>(null);
  const [openWordModal, setOpenWordModal] = useState(false);
  const [newWord, setNewWord] = useState({ word_en: '', word_es: '' });
  
  // Forms
  const [triviaForm, setTriviaForm] = useState({ name_en: '', name_es: '', description_en: '', description_es: '' });
  const [wsForm, setWsForm] = useState({ name_en: '', name_es: '', description_en: '', description_es: '', rows: 12, cols: 12 });
  const [questionForm, setQuestionForm] = useState<Omit<TriviaQuestion, 'id' | 'level_id'>>({
    question_en: '',
    question_es: '',
    options_en: ['', '', '', ''],
    options_es: ['', '', '', ''],
    correct_answer: 0,
    category: '',
    reference: ''
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const tRes = await fetch(`/api/games?type=trivia&orgId=${orgId}`);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTriviaLevels(tData.levels || []);
      }

      const wRes = await fetch(`/api/games?type=wordsearch-levels&orgId=${orgId}`);
      if (wRes.ok) {
        const wData = await wRes.json();
        setWordSearchLevels(wData.levels || []);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load games', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createTriviaLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trivia_levels', payload: triviaForm })
      });
      if (!res.ok) throw new Error('Failed to create trivia level');
      toast({ title: 'Success', description: 'Trivia level created.' });
      setOpenTriviaModal(false);
      setTriviaForm({ name_en: '', name_es: '', description_en: '', description_es: '' });
      fetchGames();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  const createWsLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'word_search_levels', payload: wsForm })
      });
      if (!res.ok) throw new Error('Failed to create word search level');
      toast({ title: 'Success', description: 'Word Search level created.' });
      setOpenWsModal(false);
      setWsForm({ name_en: '', name_es: '', description_en: '', description_es: '', rows: 12, cols: 12 });
      fetchGames();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  const fetchQuestions = async (levelId: string) => {
    try {
      setLoadingQuestions(true);
      const res = await fetch(`/api/games?type=trivia-questions&levelId=${levelId}&orgId=${orgId}`);
      if (res.ok) {
        const data = await res.json();
        setTriviaQuestions(data.questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTriviaLevel) return;
    try {
      const payload = {
        ...questionForm,
        options_en: JSON.stringify(questionForm.options_en),
        options_es: JSON.stringify(questionForm.options_es),
        correct_answer: Number(questionForm.correct_answer),
        level_id: selectedTriviaLevel.id
      };
      
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'trivia_questions', 
          payload 
        })
      });
      if (!res.ok) throw new Error('Save failed');
      toast({ title: 'Success', description: 'Question saved.' });
      setOpenQuestionModal(false);
      fetchQuestions(selectedTriviaLevel.id);
      fetchGames(); // Refresh count
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save question', variant: 'destructive' });
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWsLevel) return;
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'word_search_words', 
          payload: { ...newWord, level_id: selectedWsLevel.id } 
        })
      });
      if (!res.ok) throw new Error('Save failed');
      toast({ title: 'Success', description: 'Word added.' });
      setNewWord({ word_en: '', word_es: '' });
      setOpenWordModal(false);
      fetchGames(); // Words are nested, so refresh levels
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add word', variant: 'destructive' });
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      const res = await fetch(`/api/games?type=trivia_questions&id=${id}`, { method: 'DELETE' });
      if (res.ok && selectedTriviaLevel) fetchQuestions(selectedTriviaLevel.id);
      fetchGames();
    } catch (err) { console.error(err); }
  };

  const deleteWord = async (id: string) => {
    if (!confirm('Delete this word?')) return;
    try {
      await fetch(`/api/games?type=word_search_words&id=${id}`, { method: 'DELETE' });
      fetchGames();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this level? This will remove all questions/words inside it.')) return;
    try {
      const res = await fetch(`/api/games?type=${type}&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast({ title: 'Deleted', description: 'Level removed successfully' });
      fetchGames();
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Games Management</h3>
      </div>

      {/* Bible Trivia Game */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎯 Bible Trivia</span>
            <Badge variant="secondary">{triviaLevels.length} levels</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {triviaLevels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No trivia levels found. Add one to get started!</p>
            ) : (
              triviaLevels.map((level) => (
                <div key={level.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{level.name_en} / {level.name_es}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{level.description_en}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        onClick={() => {
                          setSelectedTriviaLevel(level);
                          fetchQuestions(level.id);
                        }}
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 cursor-pointer transition-colors"
                      >
                        Manage {level.question_count || 0} Questions
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete('trivia_levels', level.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedTriviaLevel && (
            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">Questions for: {selectedTriviaLevel.name_en}</h4>
                <Button size="sm" variant="outline" onClick={() => setSelectedTriviaLevel(null)}>Close</Button>
              </div>
              
              <div className="space-y-2">
                {loadingQuestions ? <p>Loading questions...</p> : triviaQuestions.map(q => (
                  <div key={q.id} className="p-2 border rounded text-sm flex justify-between items-center bg-gray-50">
                    <span className="line-clamp-1">{q.question_en}</span>
                    <Button size="icon" variant="ghost" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                  </div>
                ))}
                  <Button variant="outline" className="w-full text-xs" onClick={() => {
                  setQuestionForm({
                    question_en: '', question_es: '',
                    options_en: ['', '', '', ''], options_es: ['', '', '', ''],
                    correct_answer: 0, category: '', reference: ''
                  });
                  setOpenQuestionModal(true);
                }}>+ Add Question</Button>
              </div>
            </div>
          )}
          
          <Dialog open={openTriviaModal} onOpenChange={setOpenTriviaModal}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Trivia Level
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Trivia Level</DialogTitle>
                <DialogDescription>Define the game rules and language targets.</DialogDescription>
              </DialogHeader>
              <form onSubmit={createTriviaLevel} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title (English)</Label>
                    <Input required value={triviaForm.name_en} onChange={e => setTriviaForm({...triviaForm, name_en: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title (Spanish)</Label>
                    <Input required value={triviaForm.name_es} onChange={e => setTriviaForm({...triviaForm, name_es: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea value={triviaForm.description_en} onChange={e => setTriviaForm({...triviaForm, description_en: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Description (Spanish)</Label>
                  <Textarea value={triviaForm.description_es} onChange={e => setTriviaForm({...triviaForm, description_es: e.target.value})} />
                </div>
                <Button type="submit" className="w-full"><Save className="w-4 h-4 mr-2" /> Create Level</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Question Editor Modal */}
          <Dialog open={openQuestionModal} onOpenChange={setOpenQuestionModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Trivia Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Question (EN)</Label>
                    <Input required value={questionForm.question_en} onChange={e => setQuestionForm({...questionForm, question_en: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Question (ES)</Label>
                    <Input required value={questionForm.question_es} onChange={e => setQuestionForm({...questionForm, question_es: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Options (English) - Select the correct answer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionForm.options_en.map((opt, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase text-gray-500">Option {i+1}</Label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="radio" 
                              name="correct_answer" 
                              checked={questionForm.correct_answer === i}
                              onChange={() => setQuestionForm({...questionForm, correct_answer: i})}
                              className="cursor-pointer"
                            />
                            {questionForm.correct_answer === i && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px] h-4 uppercase">Correct</Badge>}
                          </div>
                        </div>
                        <Input placeholder={`Option ${i+1}`} value={opt} onChange={e => {
                          const next = [...questionForm.options_en];
                          next[i] = e.target.value;
                          setQuestionForm({...questionForm, options_en: next});
                        }} required />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Options (Spanish)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionForm.options_es.map((opt, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <Label className="text-[10px] uppercase text-gray-500">Opción {i+1}</Label>
                        <Input placeholder={`Opción ${i+1}`} value={opt} onChange={e => {
                          const next = [...questionForm.options_es];
                          next[i] = e.target.value;
                          setQuestionForm({...questionForm, options_es: next});
                        }} required />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Bible Reference</Label>
                    <Input placeholder="e.g. Genesis 1:1" value={questionForm.reference} onChange={e => setQuestionForm({...questionForm, reference: e.target.value})} />
                  </div>
                </div>

                <Button type="submit" className="w-full">Save Question</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Word Search Game */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🔍 Word Search</span>
            <Badge variant="secondary">{wordSearchLevels.length} levels</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wordSearchLevels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No word search levels found</p>
            ) : (
              wordSearchLevels.map((level) => (
                <div key={level.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{level.name_en} / {level.name_es}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {level.rows}x{level.cols} grid
                      </Badge>
                      <Badge 
                        variant="outline" 
                        onClick={() => setSelectedWsLevel(level)}
                        className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 cursor-pointer transition-colors"
                      >
                        Manage {level.words?.length || 0} Words
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete('word_search_levels', level.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedWsLevel && (
            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">Words for: {selectedWsLevel.name_en}</h4>
                <Button size="sm" variant="outline" onClick={() => setSelectedWsLevel(null)}>Close</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedWsLevel.words?.map(w => (
                  <Badge key={w.id} variant="secondary" className="flex items-center gap-1">
                    {w.word_en} <Trash2 className="w-3 h-3 cursor-pointer text-red-500" onClick={() => deleteWord(w.id)} />
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => setOpenWordModal(true)}>+ Add Word</Button>
              </div>
            </div>
          )}

          <Dialog open={openWsModal} onOpenChange={setOpenWsModal}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Word Search Level
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Word Search Matrix</DialogTitle>
                <DialogDescription>Define the grid dimensions and title.</DialogDescription>
              </DialogHeader>
              <form onSubmit={createWsLevel} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title (English)</Label>
                    <Input required value={wsForm.name_en} onChange={e => setWsForm({...wsForm, name_en: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title (Spanish)</Label>
                    <Input required value={wsForm.name_es} onChange={e => setWsForm({...wsForm, name_es: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grid Rows (e.g. 12)</Label>
                    <Input type="number" min="5" max="25" required value={wsForm.rows} onChange={e => setWsForm({...wsForm, rows: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grid Cols (e.g. 12)</Label>
                    <Input type="number" min="5" max="25" required value={wsForm.cols} onChange={e => setWsForm({...wsForm, cols: parseInt(e.target.value)})} />
                  </div>
                </div>
                <Button type="submit" className="w-full"><Save className="w-4 h-4 mr-2" /> Create Level</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Word Add Modal */}
          <Dialog open={openWordModal} onOpenChange={setOpenWordModal}>
            <DialogContent className="max-w-xs">
              <DialogHeader><DialogTitle>Add Word</DialogTitle></DialogHeader>
              <form onSubmit={handleAddWord} className="space-y-4">
                <div className="space-y-2">
                  <Label>Word (EN)</Label>
                  <Input required value={newWord.word_en} onChange={e => setNewWord({...newWord, word_en: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-2">
                  <Label>Word (ES - Optional)</Label>
                  <Input value={newWord.word_es} onChange={e => setNewWord({...newWord, word_es: e.target.value.toUpperCase()})} />
                </div>
                <Button type="submit" className="w-full">Add Word</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
