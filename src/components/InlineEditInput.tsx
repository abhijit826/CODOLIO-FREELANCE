import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface InlineEditInputProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const InlineEditInput = ({ value, onSave, onCancel }: InlineEditInputProps) => {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) onSave(text.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <Input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => text.trim() ? onSave(text.trim()) : onCancel()}
      className="h-7 text-sm flex-1"
    />
  );
};
