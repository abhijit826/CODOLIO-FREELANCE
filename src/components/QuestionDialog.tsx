import { useState, useEffect } from 'react';
import { Question } from '@/store/useSheetStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestionDialogProps {
  open: boolean;
  question?: Question;
  onClose: () => void;
  onSave: (data: { title: string; difficulty: 'easy' | 'medium' | 'hard'; link?: string }) => void;
}

export const QuestionDialog = ({ open, question, onClose, onSave }: QuestionDialogProps) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(question?.title || '');
      setDifficulty(question?.difficulty || 'easy');
      setLink(question?.link || '');
    }
  }, [open, question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), difficulty, link: link.trim() || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit Question' : 'Add Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-title">Title</Label>
            <Input id="q-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Two Sum" autoFocus />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-link">Link (optional)</Label>
            <Input id="q-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://leetcode.com/..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
