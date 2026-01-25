import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F7] text-gray-800">
      <header className="w-full px-8 py-4 flex justify-between items-center border-b border-gray-200">
        <Link href="/" className="text-2xl font-semibold font-serif">Emanuel Web Design</Link>
        <nav>
          <Link href="/dashboard/client-portal" className="px-4 py-2 text-lg font-medium hover:text-gray-900 transition-colors">
            Client Portal
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-serif font-bold text-gray-900">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            For inquiries, please reach out to us at <a href="mailto:hello@emanuelwebdesign.com" className="text-blue-600 hover:underline">hello@emanuelwebdesign.com</a>.
          </p>
        </div>
      </main>

      <footer className="w-full py-6 text-center border-t border-gray-200">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Emanuel Web Design. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
