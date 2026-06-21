import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Emanuel Web Design",
  description: "Privacy policy for Church Sites and Apps developed by Emanuel Web Design.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-20">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none text-[color:var(--muted-foreground)]">
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[color:var(--foreground)]">1. Introduction</h2>
        <p className="mb-4">
          This Privacy Policy applies to the Church Sites and mobile applications developed by Emanuel Web Design ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[color:var(--foreground)]">2. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the applications, or otherwise when you contact us.
        </p>
        <p className="mb-4">
          The personal information that we collect depends on the context of your interactions with us and the applications, the choices you make, and the products and features you use. The personal information we collect may include the following:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Name and Contact Data. We may collect your first and last name, email address, postal address, phone number, and other similar contact data.</li>
          <li>Credentials. We may collect passwords, password hints, and similar security information used for authentication and account access.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[color:var(--foreground)]">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use personal information collected via our applications for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To facilitate account creation and logon process.</li>
          <li>To send administrative information to you.</li>
          <li>To fulfill and manage your requests.</li>
          <li>To request feedback and to contact you about your use of our applications.</li>
          <li>To protect our Services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[color:var(--foreground)]">4. Will Your Information Be Shared With Anyone?</h2>
        <p className="mb-4">
          We only share and disclose your information in the following situations:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Compliance with Laws. We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
          <li>Vital Interests and Legal Rights. We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
          <li>Vendors, Consultants and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[color:var(--foreground)]">5. Contact Us</h2>
        <p className="mb-4">
          If you have questions or comments about this policy, you may email us or contact us via our website at emanuelavina.com.
        </p>
      </div>
    </div>
  );
}
