import { useRouter } from 'next/navigation';
import { File, Laptop, Moon, SearchIcon, Sun } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useTheme } from 'next-themes';

type Props = {
  className?: string;
};

const searchData = [
  { title: 'Introduction', href: '/docs/introduction' },
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'Components', href: '/docs/components' },
  { title: 'Theming', href: '/docs/theming' },
  { title: 'CLI', href: '/docs/cli' },
];

export default function SearchBar(props: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { setTheme } = useTheme();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = form.q as HTMLInputElement;

    const query = formData.value.trim();

    if (!query) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <div className={cn('relative', props.className)}>
      <button type="button" onClick={() => setOpen(true)}>
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {searchData.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  runCommand(() => router.push(item.href));
                }}
              >
                <File className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
