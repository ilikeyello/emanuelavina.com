import { auth } from '@clerk/nextjs/server';
import { QuestionnaireForm } from './_components/questionnaire-form';

export const metadata = {
  title: 'Onboarding Questionnaire | Emanuel Web Design',
  description: 'Provide the necessary information to get your new church website started.',
};

export default async function QuestionnairePage() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return (
      <div className="text-center">
        <p>You must be signed in to an organization to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-serif font-bold">Onboarding Questionnaire</h1>
        <p className="text-lg text-[color:var(--muted-foreground)]">
          Welcome! Please fill out this form to help me get started on your new website.
        </p>
      </div>
      <div className="mt-10">
        <QuestionnaireForm />
      </div>
    </div>
  );
}
