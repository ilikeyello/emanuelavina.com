'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface QuestionnaireData {
  churchName: string;
  contactName: string;
  contactEmail: string;
  websiteGoals: string;
  keyFeatures: string[];
  designPreferences?: string;
  existingWebsite?: string;
  socialMedia?: string;
}

export async function sendQuestionnaire(data: QuestionnaireData): Promise<{ error: string | null }> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: 'You must be signed in to submit this form.' };
  }

  try {
    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ organizationId: orgId });

    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">New Onboarding Questionnaire Submission</h1>
        <p><strong>Organization:</strong> ${org.name} (${org.id})</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <h2>Church & Contact Info</h2>
        <ul>
          <li><strong>Church Name:</strong> ${data.churchName}</li>
          <li><strong>Contact Name:</strong> ${data.contactName}</li>
          <li><strong>Contact Email:</strong> ${data.contactEmail}</li>
        </ul>

        <h2>Project Details</h2>
        <h3>Main Goals:</h3>
        <p>${data.websiteGoals}</p>

        <h3>Key Features:</h3>
        <ul>
          ${data.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>

        <h3>Design Preferences:</h3>
        <p>${data.designPreferences || 'Not provided'}</p>

        <h3>Existing Website:</h3>
        <p>${data.existingWebsite || 'Not provided'}</p>

        <h3>Social Media Links:</h3>
        <p>${data.socialMedia || 'Not provided'}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: 'Emanuel Web Design <contact@emanuelavina.com>',
      to: ['contact@emanuelavina.com'],
      subject: `New Questionnaire from ${data.churchName}`,
      replyTo: data.contactEmail,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { error: 'Failed to send questionnaire.' };
    }

    return { error: null };

  } catch (e) {
    console.error('Server error:', e);
    return { error: 'An unexpected server error occurred.' };
  }
}
