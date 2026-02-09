import { NextRequest, NextResponse } from 'next/server';

const CHURCH_SITE_BASE_URL = 'https://prod-cne-sh82.encr.app';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameType = searchParams.get('type');
  const levelId = searchParams.get('levelId');

  try {
    let apiUrl = '';

    if (gameType === 'trivia') {
      apiUrl = `${CHURCH_SITE_BASE_URL}/trivia/simple`;
    } else if (gameType === 'wordsearch-levels') {
      apiUrl = `${CHURCH_SITE_BASE_URL}/games/wordsearch/levels`;
    } else if (gameType === 'wordsearch-puzzle' && levelId) {
      const lang = searchParams.get('lang') || 'en';
      apiUrl = `${CHURCH_SITE_BASE_URL}/games/wordsearch/puzzle/${encodeURIComponent(levelId)}?lang=${lang}`;
    }

    if (!apiUrl) {
      return NextResponse.json({ error: 'Invalid game type' }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Emanuel-Web-Design-Admin/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Games API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data from church site' },
      { status: 500 }
    );
  }
}
