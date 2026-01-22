import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { orgId, orgSlug } = await auth();

  if (orgId) {
    redirect('/dashboard/client-portal');
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-2">
          No Organization Selected
        </h2>
        <p className="text-yellow-800 mb-4">
          You need to be part of an organization to access the Client Portal.
        </p>
        <div className="space-y-2 text-sm text-yellow-700">
          <p><strong>To get started:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Click the organization switcher in the top left</li>
            <li>Create a new organization or join an existing one</li>
            <li>You'll be automatically redirected to the Client Portal</li>
          </ol>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
