'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          Zenith
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
