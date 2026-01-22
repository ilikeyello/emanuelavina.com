import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const { orgId, orgSlug, userId } = await auth();

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Your Dashboard
        </h2>
        
        {orgId ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✓ You're currently managing: <strong>{orgSlug}</strong>
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700">Access your church management tools:</p>
              <Link 
                href="/dashboard/client-portal"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Go to Client Portal →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                You're signed in, but not connected to a church organization yet.
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Next steps:</strong></p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Click the <strong>organization switcher</strong> in the top left corner</li>
                <li>Either:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li>Select an existing church organization you're part of</li>
                    <li>Create a new organization for your church</li>
                  </ul>
                </li>
                <li>Once selected, you'll have access to the Client Portal</li>
              </ol>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> If you just purchased a package, your organization ID from Clerk will be used to set up your church site. You can manage everything once you select your organization.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
