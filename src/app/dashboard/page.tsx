import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { orgSlug } = await auth();

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <h1 className="text-2xl font-bold">{orgSlug || "Client Portal"}</h1>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="p-4">
        <p className="text-lg">Welcome to the dashboard.</p>
        <p>The current organization slug is: <strong>{orgSlug}</strong></p>
      </main>
    </div>
  );
}
