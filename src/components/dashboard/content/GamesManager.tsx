'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface GamesManagerProps {
  orgId: string;
}

export default function GamesManager({ orgId }: GamesManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Games</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Game
        </Button>
      </div>
      <p className="text-gray-500 text-center py-8">Games manager - Coming soon</p>
    </div>
  );
}
