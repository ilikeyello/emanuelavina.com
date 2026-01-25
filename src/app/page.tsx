import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F7] text-gray-800">
      <header className="w-full px-8 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-semibold font-serif">Emanuel Web Design</h1>
        <nav>
          <Link href="/dashboard/client-portal" className="px-4 py-2 text-lg font-medium hover:text-gray-900 transition-colors">
            Client Portal
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h2 className="text-6xl font-serif font-bold leading-tight tracking-tight text-gray-900">
            Building Modern Sanctuaries for Worship
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            We craft clean, peaceful, and accessible websites for churches, helping you connect with your community online. Our focus is on creating a digital space that reflects the tranquility and purpose of your physical sanctuary.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <Link href="/contact" className="px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-md hover:bg-gray-900 transition-transform transform hover:scale-105">
              Start a Project
            </Link>
            <Link href="/dashboard/client-portal" className="px-8 py-4 border border-gray-300 text-gray-800 text-lg font-semibold rounded-md hover:bg-gray-100 transition-transform transform hover:scale-105">
              Client Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center border-t border-gray-200">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Emanuel Web Design. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

