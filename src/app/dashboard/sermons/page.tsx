import { getSupabase } from '@/lib/supabase/user';
import { CreateSermonForm } from './create-sermon-form';

export default async function SermonsPage() {
  let supabase;
  try {
    supabase = await getSupabase();
  } catch (e) {
    console.error(e);
    return <div>Error initializing database. Please try again.</div>;
  }

  const { data: sermons, error } = await supabase.from('sermons').select('*');

  if (error) {
    console.error('Error fetching sermons:', error);
    return <div>Error loading sermons. Please try again.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Sermon Manager</h2>
      <div className="p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Sermons</h3>
        {sermons && sermons.length > 0 ? (
          <ul>
            {sermons.map((sermon) => (
              <li key={sermon.id} className="border-b last:border-b-0 py-2">
                <p className="font-semibold">{sermon.title}</p>
                <p className="text-sm text-gray-600">Preacher: {sermon.preacher}</p>
                <p className="text-sm text-gray-500">Date: {new Date(sermon.sermon_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sermons found. Add one to get started!</p>
        )}
      </div>
      <div className="mt-8">
        <CreateSermonForm />
      </div>
    </div>
  );
}
