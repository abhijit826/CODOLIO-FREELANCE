import { Sun, Moon, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'harvest';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'harvest');
    if (theme !== 'light') {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const icon = theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Leaf className="h-4 w-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4 mr-2" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4 mr-2" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('harvest')}>
          <Leaf className="h-4 w-4 mr-2" /> Harvest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeToggle };
