'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';

interface TriviaLevel {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_count: number;
}

interface WordSearchLevel {
  id: string;
  name: string;
  description: string;
  rows: number;
  cols: number;
  words: { word_en: string; word_es: string }[];
}

interface GamesManagerProps {
  orgId: string;
}

export default function GamesManager({ orgId }: GamesManagerProps) {
  const [triviaLevels, setTriviaLevels] = useState<TriviaLevel[]>([]);
  const [wordSearchLevels, setWordSearchLevels] = useState<WordSearchLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CHURCH_SITE_BASE_URL = 'https://prod-cne-sh82.encr.app';

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trivia levels
      const triviaResponse = await fetch(`${CHURCH_SITE_BASE_URL}/trivia/simple`);
      if (triviaResponse.ok) {
        const triviaData = await triviaResponse.json();
        setTriviaLevels(triviaData.levels || []);
      }

      // Fetch word search levels
      const wordSearchResponse = await fetch(`${CHURCH_SITE_BASE_URL}/games/wordsearch/levels`);
      if (wordSearchResponse.ok) {
        const wordSearchData = await wordSearchResponse.json();
        setWordSearchLevels(wordSearchData.levels || []);
      }
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setError('Failed to load games from church site');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLevel = async (gameType: 'trivia' | 'wordsearch', levelId: string) => {
    // This would need to be implemented on the church site API
    console.log(`Delete ${gameType} level:`, levelId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Games</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Games</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchGames} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Games</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Site
          </Button>
        </div>
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
              <p className="text-gray-500 text-center py-4">No trivia levels found</p>
            ) : (
              triviaLevels.map((level) => (
                <div key={level.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{level.name}</h4>
                    <p className="text-sm text-gray-500">{level.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {level.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {level.question_count} questions
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteLevel('trivia', level.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Trivia Level
          </Button>
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
                <div key={level.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{level.name}</h4>
                    <p className="text-sm text-gray-500">{level.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {level.rows}x{level.cols} grid
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {level.words.length} words
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteLevel('wordsearch', level.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Word Search Level
          </Button>
        </CardContent>
      </Card>

      {/* Game Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a 
            href={`${CHURCH_SITE_BASE_URL}/games/trivia`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span>🎯 Play Bible Trivia</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </a>
          <a 
            href={`${CHURCH_SITE_BASE_URL}/games/wordsearch`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span>🔍 Play Word Search</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
