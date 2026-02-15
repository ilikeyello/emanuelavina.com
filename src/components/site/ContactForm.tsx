'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    church: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');

    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        setStatus('success');
        setFormData({ name: '', email: '', church: '', message: '' });
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-4 p-8">
        <h3 className="text-2xl font-serif font-semibold text-[color:var(--foreground)]">Thank you!</h3>
        <p className="text-[color:var(--muted-foreground)]">Your message has been sent. I’ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
          Full name
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            placeholder="Full name"
            disabled={isPending}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
          Email
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            placeholder="you@example.com"
            disabled={isPending}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
        Church name & location
        <input
          type="text"
          name="church"
          value={formData.church}
          onChange={handleChange}
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
          placeholder="Church name – City, State"
          disabled={isPending}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
        Project goals / message
        <textarea
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
          placeholder="Share your goals: visitors, giving, livestreams, events, timelines, and any current site."
          disabled={isPending}
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-[150px] items-center justify-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send message'}
        </button>
        <Link
          href="mailto:contact@emanuelavina.com"
          className="text-sm font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition"
        >
          or email directly
        </Link>
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600">Failed to send message. Please try again or email directly.</p>
      )}
    </form>
  );
}
