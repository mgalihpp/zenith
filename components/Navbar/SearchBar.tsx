import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { FormEvent } from 'react';

export default function SearchBar() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = form.q as HTMLInputElement;

    const query = formData.value.trim();

    if (!query) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form method="GET" action="/search" onSubmit={handleSubmit}>
      <div className="relative">
        <Input placeholder="Search" name="q" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
