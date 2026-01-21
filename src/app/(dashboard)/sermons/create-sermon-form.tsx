'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createSermon } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
      {pending ? 'Creating...' : 'Create Sermon'}
    </button>
  );
}

export function CreateSermonForm() {
  const initialState = { error: null };
  const [state, formAction] = useFormState(createSermon, initialState);

  return (
    <form action={formAction} className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h3 className="text-xl font-semibold">Add New Sermon</h3>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" name="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="preacher" className="block text-sm font-medium text-gray-700">Preacher</label>
        <input type="text" id="preacher" name="preacher" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="sermon_date" className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" id="sermon_date" name="sermon_date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <SubmitButton />
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  );
}
