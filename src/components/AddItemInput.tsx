import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface AddItemInputProps {
  placeholder: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const AddItemInput = ({ placeholder, onSave, onCancel }: AddItemInputProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) onSave(text.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-9 flex-1 text-sm"
      />
      <Button size="icon" className="h-9 w-9" onClick={() => text.trim() && onSave(text.trim())} disabled={!text.trim()}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
