import { useRouter } from 'next/navigation';
import { Laptop, Moon, SearchIcon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useTheme } from 'next-themes';
import useDebounce from '@/hooks/useDebounce';
import { useBreakpoints } from '@/hooks/useMediaQuery';

type Props = {
  className?: string;
};

// const searchData = [
//   { title: 'Introduction', href: '/docs/introduction' },
//   { title: 'Getting Started', href: '/docs/getting-started' },
//   { title: 'Components', href: '/docs/components' },
//   { title: 'Theming', href: '/docs/theming' },
//   { title: 'CLI', href: '/docs/cli' },
// ];

export default function SearchBar(props: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const debouncedInput = useDebounce(input, 200);
  const { isXs: isMobile } = useBreakpoints();

  const router = useRouter();
  const { setTheme } = useTheme();

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

  // auto submit for mobile phone
  useEffect(() => {
    if (isMobile && debouncedInput) {
      router.push(`/search?q=${debouncedInput}`);
    }
  }, [isMobile, debouncedInput, router]);

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
        <CommandInput
          placeholder="Type to search..."
          value={input}
          onValueChange={setInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              runCommand(() =>
                router.push(`/search?q=${decodeURIComponent(input)}`)
              );
            }
          }}
        />
        <CommandList>
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
