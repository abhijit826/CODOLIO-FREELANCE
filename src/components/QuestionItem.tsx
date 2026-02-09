import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ExternalLink, Pencil, Trash2, Check } from 'lucide-react';
import { Question } from '@/store/useSheetStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionItemProps {
  question: Question;
  topicId: string;
  subTopicId: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const difficultyStyles = {
  easy: 'bg-accent text-accent-foreground',
  medium: 'bg-[hsl(45_90%_92%)] text-[hsl(35_80%_35%)]',
  hard: 'bg-[hsl(0_80%_94%)] text-[hsl(0_70%_40%)]',
};

export const QuestionItem = ({ question, onToggle, onEdit, onDelete }: QuestionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all',
        'bg-card hover:shadow-card-hover',
        isDragging && 'opacity-50 shadow-elevated z-50',
        question.completed && 'opacity-70'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        onClick={onToggle}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all',
          question.completed
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30 hover:border-primary'
        )}
      >
        {question.completed && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>

      <span
        className={cn(
          'flex-1 text-sm font-medium transition-all',
          question.completed && 'line-through text-muted-foreground'
        )}
      >
        {question.title}
      </span>

      <Badge variant="secondary" className={cn('text-xs font-mono capitalize', difficultyStyles[question.difficulty])}>
        {question.difficulty}
      </Badge>

      {question.link && (
        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
