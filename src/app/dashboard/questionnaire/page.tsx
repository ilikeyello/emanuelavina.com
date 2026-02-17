import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { QuestionnaireForm } from './_components/questionnaire-form';
import QuestionnaireWithPlan from './_components/questionnaire-with-plan';

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

  return <QuestionnaireWithPlan userId={userId} orgId={orgId} />;
}
