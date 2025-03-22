'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md z-[500] px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white no-underline">
        NYC School Zones
      </Link>
      <nav>
        <Link 
          href="/about" 
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          About
        </Link>
      </nav>
    </header>
  );
} 