import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Churches</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Church
        </Button>
      </div>
      {/* Placeholder for church list */}
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-500">No churches found. Get started by creating one.</p>
      </div>
    </div>
  );
}
