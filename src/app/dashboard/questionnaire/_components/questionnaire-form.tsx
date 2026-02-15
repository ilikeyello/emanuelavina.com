'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendQuestionnaire } from '../actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  churchName: z.string().min(2, 'Church name is required.'),
  contactName: z.string().min(2, 'Contact name is required.'),
  contactEmail: z.string().email('Invalid email address.'),
  websiteGoals: z.string().min(10, 'Please describe your goals.'),
  keyFeatures: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
  designPreferences: z.string().optional(),
  existingWebsite: z.string().url().optional().or(z.literal('')),
  socialMedia: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const features = [
  { id: 'sermons', label: 'Sermon Archives' },
  { id: 'events', label: 'Event Calendar' },
  { id: 'giving', label: 'Online Giving' },
  { id: 'livestream', label: 'Livestreaming' },
  { id: 'blog', label: 'Blog / Devotionals' },
  { id: 'staff', label: 'Staff Directory' },
];

export function QuestionnaireForm() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      churchName: '',
      contactName: '',
      contactEmail: '',
      websiteGoals: '',
      keyFeatures: [],
      designPreferences: '',
      existingWebsite: '',
      socialMedia: '',
    },
  });

  const onSubmit = (values: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await sendQuestionnaire(values);
      if (result.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
      }
    });
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>Your questionnaire has been submitted. I will be in touch shortly.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="churchName">Church Name</Label>
            <Input id="churchName" {...form.register('churchName')} />
            {form.formState.errors.churchName && <p className="text-sm text-red-600">{form.formState.errors.churchName.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Primary Contact Name</Label>
              <Input id="contactName" {...form.register('contactName')} />
              {form.formState.errors.contactName && <p className="text-sm text-red-600">{form.formState.errors.contactName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Primary Contact Email</Label>
              <Input id="contactEmail" type="email" {...form.register('contactEmail')} />
              {form.formState.errors.contactEmail && <p className="text-sm text-red-600">{form.formState.errors.contactEmail.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What are the main goals for your new website?</Label>
            <Textarea {...form.register('websiteGoals')} placeholder="e.g., reach new visitors, improve online giving, create a better sermon archive..." />
            {form.formState.errors.websiteGoals && <p className="text-sm text-red-600">{form.formState.errors.websiteGoals.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>Which key features are most important to you?</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={feature.id}
                    onCheckedChange={(checked) => {
                      const currentFeatures = form.getValues('keyFeatures');
                      if (checked) {
                        form.setValue('keyFeatures', [...currentFeatures, feature.label]);
                      } else {
                        form.setValue('keyFeatures', currentFeatures.filter(f => f !== feature.label));
                      }
                    }}
                  />
                  <Label htmlFor={feature.id} className="font-normal">{feature.label}</Label>
                </div>
              ))}
            </div>
            {form.formState.errors.keyFeatures && <p className="text-sm text-red-600">{form.formState.errors.keyFeatures.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Design Preferences</Label>
            <Textarea {...form.register('designPreferences')} placeholder="e.g., colors, styles, other websites you like..." />
          </div>

          <div className="space-y-2">
            <Label>Existing Website URL (if any)</Label>
            <Input {...form.register('existingWebsite')} placeholder="https://..." />
            {form.formState.errors.existingWebsite && <p className="text-sm text-red-600">{form.formState.errors.existingWebsite.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <Textarea {...form.register('socialMedia')} placeholder="e.g., Facebook, YouTube..." />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Questionnaire'}
          </Button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
