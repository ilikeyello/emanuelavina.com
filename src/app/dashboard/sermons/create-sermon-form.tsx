'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createSermon } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating...' : 'Create Sermon'}
    </Button>
  );
}

export function CreateSermonForm({ onSuccess }: { onSuccess?: () => void }) {
  const initialState = { error: null };
  const [state, formAction] = useFormState(createSermon, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error === null && formRef.current?.checkValidity()) {
      onSuccess?.();
      formRef.current?.reset();
    }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preacher">Preacher</Label>
        <Input id="preacher" name="preacher" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sermon_date">Date</Label>
        <Input id="sermon_date" name="sermon_date" type="date" required />
      </div>
      <SubmitButton />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
